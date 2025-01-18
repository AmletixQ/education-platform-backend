import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { CourseService } from "./course.service";
import { UserId } from "src/user/decorators/userId.decorator";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CreateCourseDto, UpdateCourseDto } from "./dto/create.dto";

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

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
  @Patch(":courseId")
  addStudent(
    @Body("studentId") studentId: string,
    @Param("courseId") courseId: string,
  ) {
    return this.courseService.addStudent(studentId, courseId);
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
