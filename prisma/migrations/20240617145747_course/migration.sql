/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,sessionId]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_studentId_subjectId_sessionId_key" ON "CourseEnrollment"("studentId", "subjectId", "sessionId");
