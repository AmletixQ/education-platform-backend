import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CourseModule } from "./course/course.module";

@Module({
  imports: [UserModule, AuthModule, CourseModule],
})
export class AppModule {}
