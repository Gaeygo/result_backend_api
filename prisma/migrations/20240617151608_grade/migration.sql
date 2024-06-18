/*
  Warnings:

  - You are about to drop the column `termId` on the `CourseEnrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_termId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_courseEnrollmentId_fkey";

-- AlterTable
ALTER TABLE "CourseEnrollment" DROP COLUMN "termId";
