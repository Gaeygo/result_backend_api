/*
  Warnings:

  - You are about to drop the column `firstname` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `middlename` on the `Student` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "firstname",
DROP COLUMN "lastname",
DROP COLUMN "middlename",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;
