/*
  Warnings:

  - You are about to drop the column `student_id` on the `courses` table. All the data in the column will be lost.
  - Made the column `course_id` on table `homeworks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_student_id_fkey";

-- DropForeignKey
ALTER TABLE "homeworks" DROP CONSTRAINT "homeworks_course_id_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "student_id";

-- AlterTable
ALTER TABLE "homeworks" ALTER COLUMN "course_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD CONSTRAINT "students_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "_CourseToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseToStudent_B_index" ON "_CourseToStudent"("B");

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToStudent" ADD CONSTRAINT "_CourseToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
