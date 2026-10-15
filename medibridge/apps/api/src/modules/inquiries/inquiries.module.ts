import { Module } from "@nestjs/common";
import { JobsModule } from "../../jobs/jobs.module";
import { UploadsModule } from "../uploads/uploads.module";
import { InquiriesController } from "./inquiries.controller";
import { InquiriesService } from "./inquiries.service";

@Module({
	imports: [JobsModule, UploadsModule],
	controllers: [InquiriesController],
	providers: [InquiriesService],
	exports: [InquiriesService],
})
export class InquiriesModule {}
