import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { BadRequestException, Injectable, Logger, NotFoundException, Optional, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectQueue } from "@nestjs/bullmq";
import type { Queue } from "bullmq";
import type {
  DocumentUploadInput,
  GuestDocumentCompleteInput,
  InquiryRequestInput,
} from "@medibridge/shared";
import { FieldEncryptionService } from "../../common/security/field-encryption.service";
import { JOB_QUEUES } from "../../jobs/job-queues";
import { PrismaService } from "../../prisma/prisma.service";
import { S3StorageService } from "../uploads/s3-storage.service";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const UPLOAD_GRANT_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: FieldEncryptionService,
    private readonly config: ConfigService,
    private readonly storage: S3StorageService,
    @Optional() @InjectQueue(JOB_QUEUES.email) private readonly emailQueue?: Queue,
  ) {}

  async create(input: InquiryRequestInput) {
    const uploadToken = randomBytes(32).toString("base64url");
    const inquiry = await this.prisma.$transaction(async (transaction) => {
      if (input.treatmentId) {
        const treatment = await transaction.treatment.findFirst({
          where: { id: input.treatmentId, published: true },
          select: { id: true },
        });
        if (!treatment) throw new NotFoundException("Treatment not found");
      }

      const coordinators = await transaction.coordinatorProfile.findMany({
        orderBy: [{ activeLeads: "asc" }, { id: "asc" }],
        take: 100,
        select: { id: true, activeLeads: true, maxLeads: true },
      });
      let assignedToId: string | undefined;

      for (const coordinator of coordinators) {
        if (coordinator.activeLeads >= coordinator.maxLeads) continue;
        const claimed = await transaction.coordinatorProfile.updateMany({
          where: { id: coordinator.id, activeLeads: { lt: coordinator.maxLeads } },
          data: { activeLeads: { increment: 1 } },
        });
        if (claimed.count === 1) {
          assignedToId = coordinator.id;
          break;
        }
      }

      const created = await transaction.inquiry.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          country: input.country,
          treatmentId: input.treatmentId,
          treatmentRequested: input.treatment,
          conditionTextEncrypted: this.encryption.encrypt(input.conditionText),
          preferredCountry: input.preferredCountry,
          preferredCity: input.preferredCity,
          timeline: input.timeline,
          budgetUsd: input.budgetUsd,
          consent: true,
          consentPolicyVersion: input.consentPolicyVersion,
          uploadTokenHash: hashToken(uploadToken),
          uploadTokenExpiresAt: new Date(Date.now() + UPLOAD_GRANT_TTL_MS),
          assignedToId,
        },
        select: { id: true, reference: true, status: true, createdAt: true },
      });

      await transaction.auditLog.create({
        data: {
          action: "INQUIRY_CREATED",
          entity: "Inquiry",
          entityId: created.id,
          metadata: { consentPolicyVersion: input.consentPolicyVersion },
        },
      });
      return created;
    });

    if (this.config.get<string>("RESEND_API_KEY") && this.emailQueue) {
      void this.emailQueue.add("inquiry-received", {
        to: input.email,
        reference: inquiry.reference,
      }).catch(() => this.logger.warn("Could not enqueue inquiry confirmation email"));
    }

    return {
      reference: inquiry.reference,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      uploadToken,
    };
  }

  async presignGuestDocument(reference: string, token: string, input: DocumentUploadInput) {
    await this.authorizeGuestUpload(reference, token);
    return this.storage.createUploadUrl(`inquiry-${reference}`, input.filename, input.contentType, input.sizeBytes);
  }

  async completeGuestDocument(reference: string, token: string, input: GuestDocumentCompleteInput) {
    const inquiry = await this.authorizeGuestUpload(reference, token);
    await this.storage.verifyUploadedObject(
      `inquiry-${reference}`,
      input.key,
      input.contentType,
      input.sizeBytes,
    );

    return this.prisma.$transaction(async (transaction) => {
      const document = await transaction.medicalDocument.create({
        data: {
          inquiryId: inquiry.id,
          filename: input.filename,
          mimeType: input.contentType,
          sizeBytes: input.sizeBytes,
          s3Key: input.key,
          encrypted: true,
        },
        select: { id: true, filename: true, mimeType: true, sizeBytes: true, createdAt: true },
      });
      await transaction.auditLog.create({
        data: {
          action: "MEDICAL_DOCUMENT_UPLOADED",
          entity: "MedicalDocument",
          entityId: document.id,
          metadata: { inquiryId: inquiry.id, mimeType: document.mimeType, sizeBytes: document.sizeBytes },
        },
      });
      return document;
    });
  }

  private async authorizeGuestUpload(reference: string, token: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { reference },
      select: { id: true, reference: true, uploadTokenHash: true, uploadTokenExpiresAt: true },
    });
    if (!inquiry) throw new NotFoundException("Inquiry not found");
    const suppliedHash = Buffer.from(hashToken(token), "hex");
    const storedHash = Buffer.from(inquiry.uploadTokenHash ?? "", "hex");
    if (
      storedHash.length !== suppliedHash.length
      || !inquiry.uploadTokenExpiresAt
      || inquiry.uploadTokenExpiresAt <= new Date()
      || !timingSafeEqual(storedHash, suppliedHash)
    ) {
      throw new UnauthorizedException("Upload grant is invalid or expired");
    }
    return inquiry;
  }
}
