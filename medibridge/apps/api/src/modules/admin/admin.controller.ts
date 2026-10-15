import { BadRequestException, Body, Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Role } from "@prisma/client";
import {
  adminInquiryQuerySchema,
  adminInquiryUpdateSchema,
  contactMessageQuerySchema,
  contactMessageUpdateSchema,
  reviewModerationSchema,
} from "@medibridge/shared";
import type { AuthenticatedRequest } from "../../common/guards/jwt-auth.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@ApiTags("admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("overview")
  @Roles("SUPER_ADMIN")
  async overview() {
    return { data: await this.admin.getOverview() };
  }

  @Get("inquiries")
  @Roles("COORDINATOR", "SUPER_ADMIN")
  async listInquiries(
    @Req() request: AuthenticatedRequest,
    @Query() query: Record<string, string | undefined>,
  ) {
    const parsed = adminInquiryQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid inquiry filters",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    const result = await this.admin.listInquiries(parsed.data, {
      id: request.user!.sub,
      role: request.user!.role as Role,
    });
    return {
      data: result.data,
      meta: {
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
        total: result.total,
        pageCount: Math.ceil(result.total / parsed.data.pageSize),
      },
    };
  }

  @Get("inquiries/:id")
  @Roles("COORDINATOR", "SUPER_ADMIN")
  async inquiryDetail(@Req() request: AuthenticatedRequest, @Param("id") id: string) {
    return {
      data: await this.admin.getInquiryDetail(id, {
        id: request.user!.sub,
        role: request.user!.role as Role,
      }),
    };
  }

  @Patch("inquiries/:id")
  @Roles("COORDINATOR", "SUPER_ADMIN")
  async updateInquiry(
    @Req() request: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    const parsed = adminInquiryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid inquiry update",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return {
      data: await this.admin.updateInquiry(id, {
        id: request.user!.sub,
        role: request.user!.role as Role,
      }, parsed.data),
    };
  }

  @Patch("reviews/:id")
  @Roles("SUPER_ADMIN")
  async moderateReview(
    @Req() request: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    const parsed = reviewModerationSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid moderation decision",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.admin.moderateReview(id, request.user!.sub, parsed.data.approved) };
  }

  @Get("contact")
  @Roles("SUPER_ADMIN")
  async listContactMessages(@Query() query: Record<string, string | undefined>) {
    const parsed = contactMessageQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid contact filters",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    const result = await this.admin.listContactMessages(parsed.data);
    return {
      data: result.data,
      meta: {
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
        total: result.total,
        pageCount: Math.ceil(result.total / parsed.data.pageSize),
      },
    };
  }

  @Get("contact/:id")
  @Roles("SUPER_ADMIN")
  async getContactMessage(@Req() request: AuthenticatedRequest, @Param("id") id: string) {
    return { data: await this.admin.getContactMessage(id, request.user!.sub) };
  }

  @Patch("contact/:id")
  @Roles("SUPER_ADMIN")
  async updateContactMessage(
    @Req() request: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ) {
    const parsed = contactMessageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid contact status",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.admin.updateContactMessage(id, request.user!.sub, parsed.data.status) };
  }
}
