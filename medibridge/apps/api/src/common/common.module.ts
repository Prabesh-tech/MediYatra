import { Global, Module } from "@nestjs/common";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { CsrfGuard } from "./guards/csrf.guard";
import { RolesGuard } from "./guards/roles.guard";
import { FieldEncryptionService } from "./security/field-encryption.service";

@Global()
@Module({
  providers: [AllExceptionsFilter, CsrfGuard, RolesGuard, FieldEncryptionService],
  exports: [AllExceptionsFilter, CsrfGuard, RolesGuard, FieldEncryptionService],
})
export class CommonModule {}
