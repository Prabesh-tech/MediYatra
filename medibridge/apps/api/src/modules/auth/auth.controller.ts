import { randomBytes } from "node:crypto";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { emailSchema, emailTokenSchema, loginSchema, passwordResetSchema, registerSchema } from "@medibridge/shared";
import { Public } from "../../common/decorators/public.decorator";
import { AuthService } from "./auth.service";

type CookieRequest = Request & {
  cookies?: Record<string, string | undefined>;
};

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Get("csrf")
  createCsrfToken(@Res({ passthrough: true }) response: Response) {
    const token = randomBytes(32).toString("hex");
    response.cookie("csrf_token", token, {
      httpOnly: false,
      secure: this.isProduction(),
      sameSite: "lax",
      path: "/api",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { csrfToken: token };
  }

  @Public()
  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() body: unknown) {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) this.badRequest(parsed.error.issues);
    return this.auth.register(parsed.data);
  }

  @Public()
  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) this.badRequest(parsed.error.issues);
    const result = await this.auth.login(parsed.data.email, parsed.data.password);
    this.setSessionCookies(response, result.tokens);
    return { data: { user: result.user, expiresIn: result.tokens.expiresIn } };
  }

  @Public()
  @Post("verify-email")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async verifyEmail(@Body() body: unknown) {
    const parsed = emailTokenSchema.safeParse(body);
    if (!parsed.success) this.badRequest(parsed.error.issues);
    await this.auth.verifyEmail(parsed.data.token);
    return { status: "verified" };
  }

  @Public()
  @Post("request-password-reset")
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async requestPasswordReset(@Body() body: unknown) {
    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) this.badRequest(parsed.error.issues);
    return this.auth.requestPasswordReset(parsed.data.email);
  }

  @Public()
  @Post("reset-password")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async resetPassword(@Body() body: unknown) {
    const parsed = passwordResetSchema.safeParse(body);
    if (!parsed.success) this.badRequest(parsed.error.issues);
    await this.auth.resetPassword(parsed.data.token, parsed.data.password);
    return { status: "password-updated" };
  }

  @Public()
  @Post("refresh")
  async refresh(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.auth.rotateRefreshToken(refreshToken);
    this.setSessionCookies(response, tokens);
    return { status: "ok", expiresIn: tokens.expiresIn };
  }

  @Public()
  @Post("logout")
  async logout(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (refreshToken) await this.auth.revokeRefreshToken(refreshToken);
    response.clearCookie("access_token", this.cookieOptions("/api"));
    response.clearCookie("refresh_token", this.cookieOptions("/api/auth"));
    response.clearCookie("csrf_token", this.cookieOptions("/api"));
    return { status: "ok" };
  }

  private setSessionCookies(
    response: Response,
    tokens: { accessToken: string; refreshToken: string },
  ): void {
    const csrfToken = randomBytes(32).toString("hex");
    response.cookie("csrf_token", csrfToken, {
      ...this.cookieOptions("/api"),
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    response.cookie("access_token", tokens.accessToken, {
      ...this.cookieOptions("/api"),
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    response.cookie("refresh_token", tokens.refreshToken, {
      ...this.cookieOptions("/api/auth"),
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private cookieOptions(path: string) {
    return {
      secure: this.isProduction(),
      sameSite: "lax" as const,
      path,
    };
  }

  private isProduction(): boolean {
    return this.config.get<string>("NODE_ENV") === "production";
  }

  private badRequest(issues: readonly { path: PropertyKey[]; message: string }[]): never {
    throw new BadRequestException({
      message: "Invalid request",
      issues: issues.map(({ path, message }) => ({ path, message })),
    });
  }
}
