/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('student', 'teacher', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'student',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "admins" (
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeworks" (
    "id" TEXT NOT NULL,
    "content_url" TEXT NOT NULL,
    "comments" TEXT[],
    "lesson_id" TEXT NOT NULL,
    "course_id" TEXT,

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content_url" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "teachers" (
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_teacher_id_key" ON "courses"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "homeworks_lesson_id_key" ON "homeworks"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_id_key" ON "lessons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
