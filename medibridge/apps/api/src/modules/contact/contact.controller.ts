import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { contactMessageSchema } from "@medibridge/shared";
import { Public } from "../../common/decorators/public.decorator";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Public()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() body: unknown) {
    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid contact message",
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    return { data: await this.contact.create(parsed.data) };
  }
}
