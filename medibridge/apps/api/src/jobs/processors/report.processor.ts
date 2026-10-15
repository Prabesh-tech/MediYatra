import { Processor, WorkerHost } from "@nestjs/bullmq";
import type { Job } from "bullmq";
import { JOB_QUEUES } from "../job-queues";

@Processor(JOB_QUEUES.reports)
export class ReportProcessor extends WorkerHost {
  async process(job: Job<Record<string, unknown>>): Promise<void> {
    if (!job.name) throw new Error("Report job name is required");
  }
}
