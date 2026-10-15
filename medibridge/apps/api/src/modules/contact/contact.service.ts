import { Injectable, Logger } from "@nestjs/common";
import type { ContactMessageInput } from "@medibridge/shared";
import { FieldEncryptionService } from "../../common/security/field-encryption.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: FieldEncryptionService,
  ) {}

  async create(input: ContactMessageInput) {
    const message = await this.prisma.$transaction(async (transaction) => {
      const created = await transaction.contactMessage.create({
        data: {
          name: input.name,
          email: input.email.toLowerCase(),
          subject: input.subject,
          messageEncrypted: this.encryption.encrypt(input.message),
        },
        select: { id: true, createdAt: true },
      });
      await transaction.auditLog.create({
        data: {
          action: "CONTACT_MESSAGE_RECEIVED",
          entity: "ContactMessage",
          entityId: created.id,
        },
      });
      return created;
    });
    this.logger.log("A contact message was received");
    return { reference: message.id, receivedAt: message.createdAt };
  }
}
