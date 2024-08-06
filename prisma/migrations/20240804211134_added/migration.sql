/*
  Warnings:

  - You are about to drop the column `termId` on the `Grade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_termId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "termId";

-- CreateTable
CREATE TABLE "TermResult" (
    "id" TEXT NOT NULL,
    "courseEnrollmentId" TEXT NOT NULL,
    "termId" INTEGER NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "tutorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TermResult_courseEnrollmentId_termId_key" ON "TermResult"("courseEnrollmentId", "termId");

-- AddForeignKey
ALTER TABLE "TermResult" ADD CONSTRAINT "TermResult_courseEnrollmentId_fkey" FOREIGN KEY ("courseEnrollmentId") REFERENCES "CourseEnrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermResult" ADD CONSTRAINT "TermResult_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
