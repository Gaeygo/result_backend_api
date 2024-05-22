/*
  Warnings:

  - You are about to drop the column `studentId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `_StudentToSubject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `termId` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYear` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_B_fkey";

-- DropIndex
DROP INDEX "Grade_courseEnrollmentId_key";

-- AlterTable
ALTER TABLE "CourseEnrollment" ADD COLUMN     "termId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "studentId",
DROP COLUMN "subjectId",
DROP COLUMN "teacherId",
ADD COLUMN     "termId" INTEGER;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "year",
ADD COLUMN     "academicYear" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "subjectId" TEXT;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "sessionId",
DROP COLUMN "studentId";

-- DropTable
DROP TABLE "_StudentToSubject";

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "termName" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SessionToSubject" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToSubject_AB_unique" ON "_SessionToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToSubject_B_index" ON "_SessionToSubject"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToSubject" ADD CONSTRAINT "_SessionToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToSubject" ADD CONSTRAINT "_SessionToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
