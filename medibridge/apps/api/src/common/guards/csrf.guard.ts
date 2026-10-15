import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { AuthenticatedRequest } from "./jwt-auth.guard";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (SAFE_METHODS.has(request.method)) return true;

    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    const hasCookieSession = Boolean(cookies?.access_token || cookies?.refresh_token);
    const hasBearerToken = /^Bearer\s+\S+$/i.test(request.headers.authorization ?? "");
    if (!hasCookieSession && hasBearerToken) return true;

    const cookieToken = cookies?.csrf_token;
    const headerToken = request.get("x-csrf-token");
    if (!cookieToken || !headerToken) throw new ForbiddenException("CSRF token required");

    const cookieBuffer = Buffer.from(cookieToken);
    const headerBuffer = Buffer.from(headerToken);
    if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) {
      throw new ForbiddenException("Invalid CSRF token");
    }
    return true;
  }
}
