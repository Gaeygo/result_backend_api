/*
  Warnings:

  - You are about to drop the column `grades` on the `Student` table. All the data in the column will be lost.
  - Added the required column `classLevel` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "classLevel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "studentId" INTEGER;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "grades";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "compulsorySubjectId" TEXT,
ADD COLUMN     "electiveSubjectId" TEXT;

-- CreateTable
CREATE TABLE "CompulsorySubject" (
    "id" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "CompulsorySubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectiveSubject" (
    "id" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ElectiveSubject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_compulsorySubjectId_fkey" FOREIGN KEY ("compulsorySubjectId") REFERENCES "CompulsorySubject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_electiveSubjectId_fkey" FOREIGN KEY ("electiveSubjectId") REFERENCES "ElectiveSubject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompulsorySubject" ADD CONSTRAINT "CompulsorySubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectiveSubject" ADD CONSTRAINT "ElectiveSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
