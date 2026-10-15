import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import type { Job } from "bullmq";
import { NotificationsService } from "../../modules/notifications/notifications.service";
import { JOB_QUEUES } from "../job-queues";

@Processor(JOB_QUEUES.email)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async process(job: Job<Record<string, unknown>>): Promise<void> {
    const to = job.data.to;
    if (typeof to !== "string" || !to.includes("@")) throw new Error("Invalid email job recipient");

    if (job.name === "inquiry-received") {
      const reference = job.data.reference;
      if (typeof reference !== "string" || !/^[\da-z_-]{1,64}$/i.test(reference)) {
        throw new Error("Invalid inquiry email job payload");
      }
      await this.notifications.sendEmail(
        to,
        "We received your care inquiry",
        `<p>Thank you for contacting MediBridge. Your reference is <strong>${reference}</strong>.</p><p>A coordinator will review your request. Please do not reply with medical documents by email.</p>`,
      );
      return;
    }

    const token = job.data.token;
    if (typeof token !== "string" || !/^[\da-zA-Z_-]{32,128}$/.test(token)) {
      throw new Error("Invalid account email job payload");
    }

    const route = job.name === "email-verification"
      ? "/en/verify-email"
      : job.name === "password-reset"
        ? "/en/reset-password"
        : undefined;
    if (!route) throw new Error("Unsupported email job");

    const link = new URL(route, this.config.getOrThrow<string>("WEB_URL"));
    link.searchParams.set("token", token);
    const safeLink = link.toString().replaceAll("&", "&amp;").replaceAll('"', "&quot;");
    const subject = job.name === "email-verification" ? "Verify your MediBridge email" : "Reset your MediBridge password";
    await this.notifications.sendEmail(
      to,
      subject,
      `<p><a href="${safeLink}">Continue securely</a></p><p>If you did not request this, you can ignore this email.</p>`,
    );
  }
}
