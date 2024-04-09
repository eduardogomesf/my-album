-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_user_id_fkey";

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
