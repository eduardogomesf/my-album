/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `files` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('ACTIVE', 'DIRECTLY_DELETED', 'INDIRECTLY_DELETED');

-- AlterTable
ALTER TABLE "files" DROP COLUMN "is_deleted",
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE';
