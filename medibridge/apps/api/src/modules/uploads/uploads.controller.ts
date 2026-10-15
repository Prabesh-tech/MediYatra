import { BadRequestException, Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { completeDocumentUploadSchema, documentUploadSchema } from "@medibridge/shared";
import type { AuthenticatedRequest } from "../../common/guards/jwt-auth.guard";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post("presign")
  async presign(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = documentUploadSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid upload details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.uploads.createPresignedUpload(request.user!.sub, parsed.data) };
  }

  @Post("complete")
  async complete(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const parsed = completeDocumentUploadSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid document details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.uploads.completeUpload(request.user!.sub, parsed.data) };
  }

  @Get(":id/download")
  async download(@Req() request: AuthenticatedRequest, @Param("id") documentId: string) {
    return { data: await this.uploads.createDownloadUrl(request.user!.sub, documentId) };
  }
}
