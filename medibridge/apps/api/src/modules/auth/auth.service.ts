import { createHash, randomBytes } from "node:crypto";
import { ConflictException, Injectable, Logger, Optional, UnauthorizedException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import type { Queue } from "bullmq";
import type { RegisterInput } from "@medibridge/shared";
import type { Role } from "@prisma/client";
import { JOB_QUEUES } from "../../jobs/job-queues";
import { PrismaService } from "../../prisma/prisma.service";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const genericEmailResponse = { message: "If the address is eligible, an email will be sent." };

type AuthUser = { id: string; email: string; role: Role };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    @Optional() @InjectQueue(JOB_QUEUES.email) private readonly emailQueue?: Queue,
  ) {}

  async register(input: RegisterInput) {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return genericEmailResponse;

    const verificationToken = randomBytes(32).toString("base64url");
    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    try {
      await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          role: "PATIENT",
          emailVerificationTokens: {
            create: {
              tokenHash: hashToken(verificationToken),
              expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL_MS),
            },
          },
          patient: { create: {} },
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) return genericEmailResponse;
      throw error;
    }

    this.enqueueEmail("email-verification", email, verificationToken);
    return genericEmailResponse;
  }

  async login(emailAddress: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: emailAddress.toLowerCase() } });
    if (!user || !user.emailVerified) throw new UnauthorizedException("Invalid email or password");

    let validPassword = false;
    try {
      validPassword = await argon2.verify(user.passwordHash, password);
    } catch {
      validPassword = false;
    }
    if (!validPassword) throw new UnauthorizedException("Invalid email or password");

    const tokens = await this.issueTokenPair(user);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      tokens,
    };
  }

  async verifyEmail(rawToken: string): Promise<void> {
    const token = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
      select: { id: true, userId: true, usedAt: true, expiresAt: true },
    });
    if (!token || token.usedAt || token.expiresAt <= new Date()) {
      throw new UnauthorizedException("Verification link is invalid or expired");
    }

    await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.emailVerificationToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (consumed.count !== 1) throw new UnauthorizedException("Verification link is invalid or expired");
      await transaction.user.update({ where: { id: token.userId }, data: { emailVerified: true } });
    });
  }

  async requestPasswordReset(emailAddress: string): Promise<typeof genericEmailResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: emailAddress.toLowerCase() },
      select: { id: true, email: true, emailVerified: true },
    });
    if (!user?.emailVerified) return genericEmailResponse;

    const token = randomBytes(32).toString("base64url");
    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    });
    this.enqueueEmail("password-reset", user.email, token);
    return genericEmailResponse;
  }

  async resetPassword(rawToken: string, password: string): Promise<void> {
    const token = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
      select: { id: true, userId: true, usedAt: true, expiresAt: true },
    });
    if (!token || token.usedAt || token.expiresAt <= new Date()) {
      throw new UnauthorizedException("Password reset link is invalid or expired");
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.passwordResetToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (consumed.count !== 1) throw new UnauthorizedException("Password reset link is invalid or expired");
      await transaction.user.update({ where: { id: token.userId }, data: { passwordHash } });
      await transaction.refreshToken.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    });
  }

  async issueTokenPair(user: AuthUser) {
    const claims = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(claims),
      this.jwt.signAsync(claims, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  async rotateRefreshToken(refreshToken: string) {
    let claims: { sub: string };
    try {
      claims = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!stored || stored.userId !== claims.sub || stored.revokedAt || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const revoked = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    });
    if (revoked.count !== 1) throw new UnauthorizedException("Invalid refresh token");

    return this.issueTokenPair(stored.user);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private enqueueEmail(type: string, to: string, token: string): void {
    if (!this.config.get<string>("RESEND_API_KEY") || !this.emailQueue) {
      this.logger.warn("Account email delivery is not configured");
      return;
    }
    void this.emailQueue.add(type, { to, token }).catch(() => {
      this.logger.warn("Could not enqueue account email");
    });
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
  }
}
