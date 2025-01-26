/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `is_main` on the `albums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albums" DROP COLUMN "is_deleted",
DROP COLUMN "is_main";
