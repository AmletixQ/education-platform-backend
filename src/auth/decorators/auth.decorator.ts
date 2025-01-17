import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { ROLE } from "@prisma/client";
import { AdminGuard } from "../guards/admin.guard";
import { TeacherGuard } from "../guards/teacher.guard";

export const Auth = (role: ROLE = "student") =>
  applyDecorators(
    role === "admin"
      ? UseGuards(JwtAuthGuard, AdminGuard)
      : role === "teacher"
        ? UseGuards(JwtAuthGuard, TeacherGuard)
        : UseGuards(JwtAuthGuard),
  );
