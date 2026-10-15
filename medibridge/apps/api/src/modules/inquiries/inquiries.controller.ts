import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  guestDocumentCompleteWithGrantSchema,
  guestDocumentPresignSchema,
  inquiryRequestSchema,
} from "@medibridge/shared";
import { Public } from "../../common/decorators/public.decorator";
import { InquiriesService } from "./inquiries.service";

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Public()
  @Post()
  async create(@Body() body: unknown) {
    const parsed = inquiryRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid inquiry details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.inquiries.create(parsed.data) };
  }

  @Public()
  @Post(":reference/documents/presign")
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async presignDocument(@Param("reference") reference: string, @Body() body: unknown) {
    const parsed = guestDocumentPresignSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid upload details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    const { uploadToken, ...file } = parsed.data;
    return { data: await this.inquiries.presignGuestDocument(reference, uploadToken, file) };
  }

  @Public()
  @Post(":reference/documents/complete")
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async completeDocument(@Param("reference") reference: string, @Body() body: unknown) {
    const parsed = guestDocumentCompleteWithGrantSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid document details",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    const { uploadToken, ...file } = parsed.data;
    return { data: await this.inquiries.completeGuestDocument(reference, uploadToken, file) };
  }
}
