import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE } from "@prisma/client";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user: { id: string; role: ROLE } }>();

    if (!(request.user.role === "admin"))
      throw new ForbiddenException("You're not an admin!");

    return request.user.role === "admin";
  }
}
