import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { S3StorageService } from "./s3-storage.service";
import { UploadsService } from "./uploads.service";

@Module({
  controllers: [UploadsController],
  providers: [S3StorageService, UploadsService],
  exports: [S3StorageService, UploadsService],
})
export class UploadsModule {}
