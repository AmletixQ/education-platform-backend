import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { UserId } from "src/user/decorators/userId.decorator";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CreateCourseDto, UpdateCourseDto } from "./dto/create.dto";

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Auth()
  @Get(":courseId")
  getCourse(@Param("courseId") courseId: string) {
    return this.courseService.getCourse(courseId);
  }

  @Auth("teacher")
  @Get(":courseId/students")
  getStudents(@Param("courseId") courseId: string) {
    return this.courseService.getStudents(courseId);
  }

  @Auth()
  @Get()
  getTeacherCourses(@UserId() id: string) {
    return this.courseService.getCourses(id);
  }

  @Auth("teacher")
  @Post("create")
  create(@UserId() id: string, @Body() dto: CreateCourseDto) {
    return this.courseService.create(id, dto);
  }

  @Auth("teacher")
  @Patch("connect/:courseId")
  addStudent(
    @Body("studentId") studentId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.courseService.addStudent(studentId, courseId);
  }

  @Auth("teacher")
  @Patch("disconnect/:courseId")
  disconnectStudent(
    @Body("studentId") studentId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.courseService.disconnectStudent(studentId, courseId);
  }

  @Auth("teacher")
  @Delete(":courseId")
  deleteCourse(@Param("courseId") courseId: string) {
    return this.courseService.deleteCourse(courseId);
  }

  @Auth("teacher")
  @Put(":courseId")
  updateCourse(
    @Param("courseId") courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(courseId, dto);
  }
}
