import { Module } from "@nestjs/common";
import {
  BlogController,
  DestinationsController,
  DoctorsController,
  HospitalsController,
  PackagesController,
  TreatmentsController,
} from "./catalog.controller";
import { CatalogService } from "./catalog.service";

@Module({
  controllers: [
    TreatmentsController,
    HospitalsController,
    DoctorsController,
    DestinationsController,
    PackagesController,
    BlogController,
  ],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
