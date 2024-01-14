/*
  Warnings:

  - You are about to drop the column `isAudioAvaliable` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isAudioAvaliable",
ADD COLUMN     "isAudioAvailable" BOOLEAN NOT NULL DEFAULT false;
