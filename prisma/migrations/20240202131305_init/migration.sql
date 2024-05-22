/*
  Warnings:

  - You are about to drop the column `compulsorySubjectId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `electiveSubjectId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `CompulsorySubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ElectiveSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompulsorySubject" DROP CONSTRAINT "CompulsorySubject_classId_fkey";

-- DropForeignKey
ALTER TABLE "ElectiveSubject" DROP CONSTRAINT "ElectiveSubject_classId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_compulsorySubjectId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_electiveSubjectId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "compulsorySubjectId",
DROP COLUMN "electiveSubjectId",
ADD COLUMN     "isElective" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "CompulsorySubject";

-- DropTable
DROP TABLE "ElectiveSubject";
