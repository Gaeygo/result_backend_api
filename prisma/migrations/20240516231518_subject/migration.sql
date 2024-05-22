/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `isElective` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `subjectName` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.
  - The `id` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_SessionToSubject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassLevel" AS ENUM ('JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3');

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToSubject" DROP CONSTRAINT "_SessionToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToSubject" DROP CONSTRAINT "_SessionToSubject_B_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "subjectId";

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "adminId",
DROP COLUMN "classId",
DROP COLUMN "isElective",
DROP COLUMN "subjectName",
DROP COLUMN "teacherId",
ADD COLUMN     "allowedClassLevels" "ClassLevel"[],
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_SessionToSubject";

-- CreateTable
CREATE TABLE "SubjectAssigned" (
    "id" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" INTEGER,
    "isElective" BOOLEAN NOT NULL DEFAULT false,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "SubjectAssigned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SessionToSubjectAssigned" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToSubjectAssigned_AB_unique" ON "_SessionToSubjectAssigned"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToSubjectAssigned_B_index" ON "_SessionToSubjectAssigned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "SubjectAssigned"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToSubjectAssigned" ADD CONSTRAINT "_SessionToSubjectAssigned_A_fkey" FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToSubjectAssigned" ADD CONSTRAINT "_SessionToSubjectAssigned_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectAssigned"("id") ON DELETE CASCADE ON UPDATE CASCADE;
