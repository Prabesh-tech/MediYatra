import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { ReviewSubmissionInput } from "@medibridge/shared";
import { FieldEncryptionService } from "../../common/security/field-encryption.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: FieldEncryptionService,
  ) {}

  async listApproved(hospitalId: string, page = 1) {
    const hospital = await this.prisma.hospital.findFirst({
      where: { id: hospitalId, verified: true, published: true },
      select: { id: true },
    });
    if (!hospital) throw new NotFoundException("Hospital not found");

    const reviews = await this.prisma.review.findMany({
      where: { hospitalId, approved: true },
      select: { id: true, authorName: true, country: true, rating: true, title: true, bodyEncrypted: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
    });
    return {
      data: reviews.map(({ bodyEncrypted, ...review }) => ({ ...review, body: this.encryption.decrypt(bodyEncrypted) })),
      page,
      pageSize: 20,
    };
  }

  async submit(userId: string, hospitalId: string, input: ReviewSubmissionInput) {
    const [user, hospital, completedAppointment] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { firstName: true } }),
      this.prisma.hospital.findFirst({ where: { id: hospitalId, verified: true, published: true }, select: { id: true } }),
      this.prisma.appointment.findFirst({
        where: {
          patient: { userId },
          status: "COMPLETED",
          doctor: { is: { hospitalId } },
        },
        select: { id: true },
      }),
    ]);
    if (!user) throw new ForbiddenException("Patient account required");
    if (!hospital) throw new NotFoundException("Hospital not found");
    if (!completedAppointment) throw new ForbiddenException("A completed appointment is required to submit a review");

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const review = await transaction.review.create({
          data: {
            userId,
            hospitalId,
            authorName: "Verified patient",
            rating: input.rating,
            title: input.title,
            bodyEncrypted: this.encryption.encrypt(input.body),
            approved: false,
            consentAt: new Date(),
          },
          select: { id: true, rating: true, approved: true, createdAt: true },
        });
        await transaction.auditLog.create({
          data: {
            userId,
            action: "REVIEW_SUBMITTED",
            entity: "Review",
            entityId: review.id,
            metadata: { hospitalId },
          },
        });
        return review;
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        throw new ConflictException("A review has already been submitted for this hospital");
      }
      throw error;
    }
  }
}
