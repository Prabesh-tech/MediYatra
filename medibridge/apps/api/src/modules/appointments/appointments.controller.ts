import { BadRequestException, Body, Controller, Get, Post, Req } from "@nestjs/common";
import { appointmentRequestSchema } from "@medibridge/shared";
import type { AuthenticatedRequest } from "../../common/guards/jwt-auth.guard";
import { AppointmentsService } from "./appointments.service";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Get("me")
  async listMine(@Req() request: AuthenticatedRequest) {
    return { data: await this.appointments.listForPatient(request.user!.sub) };
  }

  @Post()
  async request(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = appointmentRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid appointment request",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.appointments.requestAppointment(request.user!.sub, parsed.data) };
  }
}
