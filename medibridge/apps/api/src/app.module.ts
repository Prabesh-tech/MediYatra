import { Controller, Get, Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CommonModule } from "./common/common.module";
import { Public } from "./common/decorators/public.decorator";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { CsrfGuard } from "./common/guards/csrf.guard";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { AdminModule } from "./modules/admin/admin.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BlogModule } from "./modules/blog/blog.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { ContactModule } from "./modules/contact/contact.module";
import { DoctorsModule } from "./modules/doctors/doctors.module";
import { DestinationsModule } from "./modules/destinations/destinations.module";
import { HospitalsModule } from "./modules/hospitals/hospitals.module";
import { InquiriesModule } from "./modules/inquiries/inquiries.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PackagesModule } from "./modules/packages/packages.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { TreatmentsModule } from "./modules/treatments/treatments.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { JobsModule } from "./jobs/jobs.module";

@Controller("health")
class HealthController {
  @Public()
  @Get()
  health() {
    return { status: "ok" };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env"],
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    CommonModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
    }),
    JobsModule,
    AuthModule,
    CatalogModule,
    ContactModule,
    UsersModule,
    InquiriesModule,
    TreatmentsModule,
    HospitalsModule,
    DoctorsModule,
    DestinationsModule,
    PackagesModule,
    AppointmentsModule,
    QuotesModule,
    PaymentsModule,
    ReviewsModule,
    BlogModule,
    UploadsModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
