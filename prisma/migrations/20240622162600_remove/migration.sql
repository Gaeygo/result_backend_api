/*
  Warnings:

  - The values [GRADE7,GRADE8,GRADE9,GRADE10,GRADE11,GRADE12] on the enum `ClassLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClassLevel_new" AS ENUM ('JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3');
ALTER TABLE "Student" ALTER COLUMN "classToBeAssignedTo" TYPE "ClassLevel_new" USING ("classToBeAssignedTo"::text::"ClassLevel_new");
ALTER TABLE "Subject" ALTER COLUMN "allowedClassLevels" TYPE "ClassLevel_new"[] USING ("allowedClassLevels"::text::"ClassLevel_new"[]);
ALTER TABLE "Class" ALTER COLUMN "classLevel" TYPE "ClassLevel_new" USING ("classLevel"::text::"ClassLevel_new");
ALTER TYPE "ClassLevel" RENAME TO "ClassLevel_old";
ALTER TYPE "ClassLevel_new" RENAME TO "ClassLevel";
DROP TYPE "ClassLevel_old";
COMMIT;
