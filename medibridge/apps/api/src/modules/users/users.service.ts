import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { DataRequestInput, ProfileUpdateInput } from "@medibridge/shared";
import { FieldEncryptionService } from "../../common/security/field-encryption.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: FieldEncryptionService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneEncrypted: true,
        role: true,
        locale: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return {
      ...user,
      phone: user.phoneEncrypted ? this.encryption.decrypt(user.phoneEncrypted) : null,
      phoneEncrypted: undefined,
    };
  }

  async updateProfile(userId: string, input: ProfileUpdateInput) {
    const { phone, ...profile } = input;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...profile,
        ...(phone !== undefined ? { phoneEncrypted: this.encryption.encrypt(phone) } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneEncrypted: true,
        role: true,
        locale: true,
      },
    });
    return {
      ...user,
      phone: user.phoneEncrypted ? this.encryption.decrypt(user.phoneEncrypted) : null,
      phoneEncrypted: undefined,
    };
  }

  async getPatientDashboard(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: {
        inquiries: {
          select: {
            id: true,
            reference: true,
            status: true,
            preferredCountry: true,
            preferredCity: true,
            createdAt: true,
            treatment: { select: { slug: true, name: true } },
            quotes: {
              select: { id: true, totalUsd: true, validUntil: true, status: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        appointments: {
          select: { id: true, type: true, scheduledAt: true, timezone: true, status: true },
          orderBy: { scheduledAt: "asc" },
        },
        documents: {
          select: { id: true, filename: true, mimeType: true, sizeBytes: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!patient) throw new ForbiddenException("Patient profile required");
    return patient;
  }

  async createDataRequest(userId: string, input: DataRequestInput) {
    return this.prisma.$transaction(async (transaction) => {
      const request = await transaction.dataRequest.create({
        data: { userId, type: input.type },
        select: { id: true, type: true, status: true, requestedAt: true },
      });
      await transaction.auditLog.create({
        data: {
          userId,
          action: `DATA_${input.type}_REQUESTED`,
          entity: "DataRequest",
          entityId: request.id,
        },
      });
      return request;
    });
  }
}
