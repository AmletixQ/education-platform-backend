import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto/create.dto";

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getCourses(userId: string) {
    const user = await this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });

    return user?.courses;
  }

  create(teacherId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: { ...dto, teacher: { connect: { userId: teacherId } } },
    });
  }

  addStudent(studentId: string, courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          connect: {
            userId: studentId,
          },
        },
      },
    });
  }

  deleteCourse(courseId: string) {
    return this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  updateCourse(courseId: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: dto,
    });
  }
}
