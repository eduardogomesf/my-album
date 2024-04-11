-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_album_id_fkey";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
