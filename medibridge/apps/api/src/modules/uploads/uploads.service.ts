import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { CompleteDocumentUploadInput, DocumentUploadInput } from "@medibridge/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { S3StorageService } from "./s3-storage.service";

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: S3StorageService,
  ) {}

  createPresignedUpload(userId: string, input: DocumentUploadInput) {
    return this.storage.createUploadUrl(userId, input.filename, input.contentType, input.sizeBytes);
  }

  async completeUpload(userId: string, input: CompleteDocumentUploadInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { patient: { select: { id: true } } },
    });
    if (!user?.patient) throw new ForbiddenException("Patient profile required");

    if (input.inquiryId) {
      const inquiry = await this.prisma.inquiry.findFirst({
        where: { id: input.inquiryId, patientId: user.patient.id },
        select: { id: true },
      });
      if (!inquiry) throw new NotFoundException("Inquiry not found");
    }

    await this.storage.verifyUploadedObject(
      userId,
      input.key,
      input.contentType,
      input.sizeBytes,
    );

    const document = await this.prisma.$transaction(async (transaction) => {
      const created = await transaction.medicalDocument.create({
        data: {
          inquiryId: input.inquiryId,
          patientId: user.patient!.id,
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
          entityId: created.id,
          metadata: { mimeType: created.mimeType, sizeBytes: created.sizeBytes },
        },
      });
      return created;
    });

    return document;
  }

  async createDownloadUrl(userId: string, documentId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { patient: { select: { id: true } } },
    });
    if (!user?.patient) throw new ForbiddenException("Patient profile required");

    const document = await this.prisma.medicalDocument.findFirst({
      where: { id: documentId, patientId: user.patient.id },
      select: { s3Key: true },
    });
    if (!document) throw new NotFoundException("Document not found");
    return this.storage.createDownloadUrl(userId, document.s3Key);
  }
}
