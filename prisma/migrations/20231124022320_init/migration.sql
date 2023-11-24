/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phonenumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phonenumber` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "phonenumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "phonenumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_name_key" ON "Admin"("name");
