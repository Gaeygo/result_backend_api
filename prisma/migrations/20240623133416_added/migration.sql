-- CreateEnum
CREATE TYPE "EndOfSessionEnum" AS ENUM ('PROMOTE', 'RETAIN', 'DEMOTE');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "endOfSessionAction" "EndOfSessionEnum";
