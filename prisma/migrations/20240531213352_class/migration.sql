/*
  Warnings:

  - You are about to drop the column `sessionId` on the `SubjectAssigned` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classAssignmentId` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectAssigned" DROP CONSTRAINT "SubjectAssigned_sessionId_fkey";

-- AlterTable
ALTER TABLE "CourseEnrollment" ADD COLUMN     "classAssignmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubjectAssigned" DROP COLUMN "sessionId";

-- CreateTable
CREATE TABLE "ClassAssignment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassAssignment_id_key" ON "ClassAssignment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_id_key" ON "CourseEnrollment"("id");

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_classAssignmentId_fkey" FOREIGN KEY ("classAssignmentId") REFERENCES "ClassAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAssignment" ADD CONSTRAINT "ClassAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAssignment" ADD CONSTRAINT "ClassAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAssignment" ADD CONSTRAINT "ClassAssignment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
