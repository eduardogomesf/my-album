/*
  Warnings:

  - You are about to drop the column `content_hash` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `encoding` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "content_hash",
DROP COLUMN "encoding";
