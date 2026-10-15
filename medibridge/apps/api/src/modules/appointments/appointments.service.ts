import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { AppointmentRequestInput } from "@medibridge/shared";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async requestAppointment(userId: string, input: AppointmentRequestInput) {
    const scheduledAt = new Date(input.scheduledAt);
    const now = Date.now();
    if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt.getTime() <= now || scheduledAt.getTime() > now + 365 * 24 * 60 * 60 * 1000) {
      throw new BadRequestException("Choose a future date within the next year");
    }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!patient) throw new ForbiddenException("Patient profile required");

    if (input.inquiryId) {
      const inquiry = await this.prisma.inquiry.findFirst({
        where: { id: input.inquiryId, patientId: patient.id },
        select: { id: true },
      });
      if (!inquiry) throw new NotFoundException("Inquiry not found");
    }

    if (input.doctorId) {
      const doctor = await this.prisma.doctor.findFirst({
        where: { id: input.doctorId, published: true, hospital: { is: { verified: true, published: true } } },
        select: { id: true },
      });
      if (!doctor) throw new NotFoundException("Doctor not found");
    }

    return this.prisma.$transaction(async (transaction) => {
      const conflict = await transaction.appointment.findFirst({
        where: {
          scheduledAt,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            { patientId: patient.id },
            ...(input.doctorId ? [{ doctorId: input.doctorId }] : []),
          ],
        },
        select: { id: true },
      });
      if (conflict) throw new ConflictException("This time is already requested");

      const appointment = await transaction.appointment.create({
        data: {
          patientId: patient.id,
          inquiryId: input.inquiryId,
          doctorId: input.doctorId,
          type: input.type,
          scheduledAt,
          timezone: input.timezone,
          status: "PENDING",
        },
        select: { id: true, type: true, scheduledAt: true, timezone: true, status: true, createdAt: true },
      });
      await transaction.auditLog.create({
        data: {
          userId,
          action: "APPOINTMENT_REQUESTED",
          entity: "Appointment",
          entityId: appointment.id,
        },
      });
      return appointment;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async listForPatient(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId }, select: { id: true } });
    if (!patient) throw new ForbiddenException("Patient profile required");
    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      select: { id: true, type: true, scheduledAt: true, timezone: true, status: true, createdAt: true },
      orderBy: { scheduledAt: "asc" },
    });
  }
}
