import { BadRequestException, Body, Controller, Get, Patch, Post, Req } from "@nestjs/common";
import { dataRequestSchema, profileUpdateSchema } from "@medibridge/shared";
import type { AuthenticatedRequest } from "../../common/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  async profile(@Req() request: AuthenticatedRequest) {
    return { data: await this.users.getProfile(request.user!.sub) };
  }

  @Patch("me")
  async updateProfile(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid profile details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.users.updateProfile(request.user!.sub, parsed.data) };
  }

  @Get("me/dashboard")
  async dashboard(@Req() request: AuthenticatedRequest) {
    return { data: await this.users.getPatientDashboard(request.user!.sub) };
  }

  @Post("me/data-requests")
  async createDataRequest(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = dataRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid data request",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.users.createDataRequest(request.user!.sub, parsed.data) };
  }
}
