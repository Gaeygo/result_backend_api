/*
  Warnings:

  - You are about to drop the column `done` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `Term` table. All the data in the column will be lost.
  - Added the required column `closedDate` to the `Term` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openDate` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Term" DROP COLUMN "done",
DROP COLUMN "open",
ADD COLUMN     "closedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "inTerm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openDate" TIMESTAMP(3) NOT NULL;
