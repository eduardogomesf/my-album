-- CreateEnum
CREATE TYPE "AlbumStatus" AS ENUM ('ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "status" "AlbumStatus" NOT NULL DEFAULT 'ACTIVE';
