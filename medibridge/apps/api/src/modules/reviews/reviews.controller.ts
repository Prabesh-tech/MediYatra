import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { reviewSubmissionSchema } from "@medibridge/shared";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import type { AuthenticatedRequest } from "../../common/guards/jwt-auth.guard";
import { ReviewsService } from "./reviews.service";

@ApiTags("reviews")
@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Public()
  @Get("hospitals/:hospitalId/reviews")
  async list(@Param("hospitalId") hospitalId: string, @Query("page") pageValue?: string) {
    const page = pageValue ? Number(pageValue) : 1;
    if (!Number.isInteger(page) || page < 1 || page > 1000) {
      throw new BadRequestException("Invalid page number");
    }
    return this.reviews.listApproved(hospitalId, page);
  }

  @Post("hospitals/:hospitalId/reviews")
  @Roles("PATIENT")
  async submit(
    @Req() request: AuthenticatedRequest,
    @Param("hospitalId") hospitalId: string,
    @Body() body: unknown,
  ) {
    const parsed = reviewSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid review",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.reviews.submit(request.user!.sub, hospitalId, parsed.data) };
  }
}
