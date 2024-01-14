/*
  Warnings:

  - You are about to drop the column `audio_url` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "audio_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "author_id" INTEGER,
ADD COLUMN     "isAudioAvaliable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "audio_url";

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_path" TEXT NOT NULL DEFAULT '/uploads/default-avatar.png',

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_full_name_key" ON "Author"("full_name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
