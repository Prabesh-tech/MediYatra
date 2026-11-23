import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const exceptionType = exception instanceof Error ? exception.name : typeof exception;
      this.logger.error(`Unhandled API exception (${exceptionType})`);
    }

    response.status(status).json({
      statusCode: status,
      message: status >= 500 ? "Internal server error" : "Request failed",
      timestamp: new Date().toISOString(),
    });
  }
}
