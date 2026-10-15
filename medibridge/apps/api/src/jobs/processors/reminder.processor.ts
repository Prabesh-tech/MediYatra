import { Processor, WorkerHost } from "@nestjs/bullmq";
import type { Job } from "bullmq";
import { JOB_QUEUES } from "../job-queues";

@Processor(JOB_QUEUES.reminders)
export class ReminderProcessor extends WorkerHost {
  async process(job: Job<Record<string, unknown>>): Promise<void> {
    if (!job.name) throw new Error("Reminder job name is required");
  }
}
