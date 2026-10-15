import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import twilio, { type Twilio } from "twilio";

@Injectable()
export class NotificationsService {
  private readonly resend?: Resend;
  private readonly twilioClient?: Twilio;

  constructor(private readonly config: ConfigService) {
    const resendKey = config.get<string>("RESEND_API_KEY");
    if (resendKey) this.resend = new Resend(resendKey);

    const accountSid = config.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = config.get<string>("TWILIO_AUTH_TOKEN");
    if (accountSid && authToken) this.twilioClient = twilio(accountSid, authToken);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) throw new ServiceUnavailableException("Email delivery is not configured");
    const from = this.config.getOrThrow<string>("RESEND_FROM");
    const result = await this.resend.emails.send({ from, to, subject, html });
    if (result.error) throw new ServiceUnavailableException("Email delivery failed");
  }

  async sendSms(to: string, body: string): Promise<void> {
    if (!this.twilioClient) throw new ServiceUnavailableException("SMS delivery is not configured");
    const from = this.config.getOrThrow<string>("TWILIO_FROM");
    await this.twilioClient.messages.create({ from, to, body });
  }
}
