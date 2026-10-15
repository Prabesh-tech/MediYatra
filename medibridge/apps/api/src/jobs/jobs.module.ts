import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { NotificationsModule } from "../modules/notifications/notifications.module";
import { JOB_QUEUES } from "./job-queues";
import { EmailProcessor } from "./processors/email.processor";
import { ReminderProcessor } from "./processors/reminder.processor";
import { ReportProcessor } from "./processors/report.processor";

export { JOB_QUEUES } from "./job-queues";

@Module({
  imports: [
    NotificationsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: config.get<number>("REDIS_PORT", 6379),
          password: config.get<string>("REDIS_PASSWORD") || undefined,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: JOB_QUEUES.email, defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 1000 } } },
      { name: JOB_QUEUES.reminders, defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 1000 } } },
      { name: JOB_QUEUES.reports, defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 1000 } } },
    ),
  ],
  providers: [EmailProcessor, ReminderProcessor, ReportProcessor],
  exports: [BullModule],
})
export class JobsModule {}
