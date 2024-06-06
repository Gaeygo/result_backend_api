/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,middleName,otherName]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_firstName_lastName_middleName_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "otherName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_firstName_lastName_middleName_otherName_key" ON "Student"("firstName", "lastName", "middleName", "otherName");
