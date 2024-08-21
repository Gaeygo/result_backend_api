/*
  Warnings:

  - Added the required column `sessionId` to the `SubjectAssigned` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectAssigned" ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
