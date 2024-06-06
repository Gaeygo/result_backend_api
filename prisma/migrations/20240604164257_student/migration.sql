/*
  Warnings:

  - You are about to drop the column `otherName` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firstName,lastName,motherMaidenName,phonenumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `motherMaidenName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_firstName_lastName_middleName_otherName_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "otherName",
ADD COLUMN     "motherMaidenName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_firstName_lastName_motherMaidenName_phonenumber_key" ON "Student"("firstName", "lastName", "motherMaidenName", "phonenumber");
