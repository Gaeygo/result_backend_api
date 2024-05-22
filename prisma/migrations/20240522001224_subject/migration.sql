-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClassLevel" ADD VALUE 'GRADE7';
ALTER TYPE "ClassLevel" ADD VALUE 'GRADE8';
ALTER TYPE "ClassLevel" ADD VALUE 'GRADE9';
ALTER TYPE "ClassLevel" ADD VALUE 'GRADE10';
ALTER TYPE "ClassLevel" ADD VALUE 'GRADE11';
ALTER TYPE "ClassLevel" ADD VALUE 'GRADE12';
