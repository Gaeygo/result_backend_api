/*
  Warnings:

  - You are about to drop the `_SessionToSubjectAssigned` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `classLevel` on the `Class` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `adminId` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `SubjectAssigned` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SessionToSubjectAssigned" DROP CONSTRAINT "_SessionToSubjectAssigned_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToSubjectAssigned" DROP CONSTRAINT "_SessionToSubjectAssigned_B_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "classLevel",
ADD COLUMN     "classLevel" "ClassLevel" NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubjectAssigned" ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_SessionToSubjectAssigned";

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAssigned" ADD CONSTRAINT "SubjectAssigned_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
