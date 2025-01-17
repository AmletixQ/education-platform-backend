import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE } from "@prisma/client";

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ id: string; role: ROLE }>();

    if (!(request.role === "teacher"))
      throw new ForbiddenException("You're not a teacher!");

    return request.role === "teacher";
  }
}
