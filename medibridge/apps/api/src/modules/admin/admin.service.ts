import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  AdminInquiryQueryInput,
  AdminInquiryUpdateInput,
  ContactMessageQueryInput,
} from "@medibridge/shared";
import type { Role } from "@prisma/client";
import { FieldEncryptionService } from "../../common/security/field-encryption.service";
import { PrismaService } from "../../prisma/prisma.service";

type AdminActor = { id: string; role: Role };

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: FieldEncryptionService,
  ) {}

  async getOverview() {
    const [inquiries, users, verifiedHospitals, publishedTreatments, statusCounts] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.user.count(),
      this.prisma.hospital.count({ where: { verified: true, published: true } }),
      this.prisma.treatment.count({ where: { published: true } }),
      this.prisma.inquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    return { inquiries, users, verifiedHospitals, publishedTreatments, statusCounts };
  }

  async listInquiries(query: AdminInquiryQueryInput, actor: AdminActor) {
    const where = {
      ...(actor.role === "COORDINATOR" ? { assignedTo: { userId: actor.id } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.q ? {
        OR: [
          { fullName: { contains: query.q, mode: "insensitive" as const } },
          { email: { contains: query.q, mode: "insensitive" as const } },
          { reference: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        select: {
          id: true,
          reference: true,
          fullName: true,
          email: true,
          phone: true,
          country: true,
          preferredCountry: true,
          preferredCity: true,
          status: true,
          consent: true,
          consentAt: true,
          createdAt: true,
          treatment: { select: { slug: true, name: true } },
          assignedTo: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
          _count: { select: { documents: true, quotes: true, appointments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.inquiry.count({ where }),
    ]);
    return { data, total };
  }

  async getInquiryDetail(id: string, actor: AdminActor) {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: {
        id,
        ...(actor.role === "COORDINATOR" ? { assignedTo: { userId: actor.id } } : {}),
      },
      select: {
        id: true,
        reference: true,
        fullName: true,
        email: true,
        phone: true,
        country: true,
        conditionTextEncrypted: true,
        preferredCountry: true,
        preferredCity: true,
        timeline: true,
        budgetUsd: true,
        consent: true,
        consentAt: true,
        consentPolicyVersion: true,
        notesEncrypted: true,
        status: true,
        createdAt: true,
        treatment: { select: { slug: true, name: true } },
        assignedTo: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
      },
    });
    if (!inquiry) throw new NotFoundException("Inquiry not found");

    await this.prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "INQUIRY_VIEWED",
        entity: "Inquiry",
        entityId: inquiry.id,
      },
    });
    return {
      ...inquiry,
      conditionText: this.encryption.decrypt(inquiry.conditionTextEncrypted),
      notes: inquiry.notesEncrypted ? this.encryption.decrypt(inquiry.notesEncrypted) : null,
      conditionTextEncrypted: undefined,
      notesEncrypted: undefined,
    };
  }

  async updateInquiry(id: string, actor: AdminActor, input: AdminInquiryUpdateInput) {
    if (actor.role === "COORDINATOR" && input.assignedCoordinatorId !== undefined) {
      throw new ForbiddenException("Coordinators cannot reassign inquiries");
    }
    return this.prisma.$transaction(async (transaction) => {
      const current = await transaction.inquiry.findFirst({
        where: {
          id,
          ...(actor.role === "COORDINATOR" ? { assignedTo: { userId: actor.id } } : {}),
        },
        select: { id: true, status: true, assignedToId: true },
      });
      if (!current) throw new NotFoundException("Inquiry not found");

      const nextAssignedId = input.assignedCoordinatorId === undefined
        ? current.assignedToId
        : input.assignedCoordinatorId;
      const nextStatus = input.status ?? current.status;
      const currentActive = current.status !== "CLOSED" && current.status !== "TREATED";
      const nextActive = nextStatus !== "CLOSED" && nextStatus !== "TREATED";
      const assignmentChanged = nextAssignedId !== current.assignedToId;

      if (current.assignedToId && currentActive && (assignmentChanged || !nextActive)) {
        await transaction.coordinatorProfile.updateMany({
          where: { id: current.assignedToId, activeLeads: { gt: 0 } },
          data: { activeLeads: { decrement: 1 } },
        });
      }
      if (nextAssignedId && nextActive && (assignmentChanged || !currentActive)) {
        const coordinator = await transaction.coordinatorProfile.findUnique({
          where: { id: nextAssignedId },
          select: { id: true, maxLeads: true },
        });
        if (!coordinator) throw new NotFoundException("Coordinator not found");
        const claimed = await transaction.coordinatorProfile.updateMany({
          where: { id: coordinator.id, activeLeads: { lt: coordinator.maxLeads } },
          data: { activeLeads: { increment: 1 } },
        });
        if (claimed.count !== 1) throw new ConflictException("Coordinator lead capacity is full");
      }

      const updated = await transaction.inquiry.update({
        where: { id },
        data: {
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.assignedCoordinatorId !== undefined ? { assignedToId: input.assignedCoordinatorId } : {}),
          ...(input.notes !== undefined ? { notesEncrypted: this.encryption.encrypt(input.notes) } : {}),
        },
        select: { id: true, reference: true, status: true, assignedToId: true, updatedAt: true },
      });
      await transaction.auditLog.create({
        data: {
          userId: actor.id,
          action: "INQUIRY_UPDATED",
          entity: "Inquiry",
          entityId: id,
          metadata: {
            previousStatus: current.status,
            status: updated.status,
            assignedToId: updated.assignedToId,
          },
        },
      });
      return updated;
    });
  }

  async moderateReview(reviewId: string, actorId: string, approved: boolean) {
    return this.prisma.$transaction(async (transaction) => {
      const review = await transaction.review.update({
        where: { id: reviewId },
        data: { approved },
        select: { id: true, hospitalId: true, approved: true, createdAt: true },
      });
      const aggregates = await transaction.review.aggregate({
        where: { hospitalId: review.hospitalId, approved: true },
        _avg: { rating: true },
        _count: { _all: true },
      });
      await transaction.hospital.update({
        where: { id: review.hospitalId },
        data: {
          rating: aggregates._avg.rating ?? 0,
          reviewCount: aggregates._count._all,
        },
      });
      await transaction.auditLog.create({
        data: {
          userId: actorId,
          action: approved ? "REVIEW_APPROVED" : "REVIEW_REJECTED",
          entity: "Review",
          entityId: reviewId,
        },
      });
      return review;
    });
  }

  async listContactMessages(query: ContactMessageQueryInput) {
    const where = query.status ? { status: query.status } : {};
    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);
    return { data, total };
  }

  async getContactMessage(id: string, actorId: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, subject: true, messageEncrypted: true, status: true, createdAt: true },
    });
    if (!message) throw new NotFoundException("Contact message not found");
    await this.prisma.auditLog.create({
      data: { userId: actorId, action: "CONTACT_MESSAGE_VIEWED", entity: "ContactMessage", entityId: id },
    });
    return { ...message, message: this.encryption.decrypt(message.messageEncrypted), messageEncrypted: undefined };
  }

  async updateContactMessage(id: string, actorId: string, status: "REVIEWED" | "CLOSED") {
    return this.prisma.$transaction(async (transaction) => {
      const exists = await transaction.contactMessage.findUnique({ where: { id }, select: { id: true } });
      if (!exists) throw new NotFoundException("Contact message not found");
      const message = await transaction.contactMessage.update({
        where: { id },
        data: { status },
        select: { id: true, status: true, updatedAt: true },
      });
      await transaction.auditLog.create({
        data: { userId: actorId, action: `CONTACT_MESSAGE_${status}`, entity: "ContactMessage", entityId: id },
      });
      return message;
    });
  }
}
