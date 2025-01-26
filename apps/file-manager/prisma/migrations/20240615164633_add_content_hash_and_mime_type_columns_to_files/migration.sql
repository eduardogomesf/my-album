/*
  Warnings:

  - Added the required column `content_hash` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "content_hash" TEXT NOT NULL,
ADD COLUMN     "mime_type" TEXT NOT NULL;
