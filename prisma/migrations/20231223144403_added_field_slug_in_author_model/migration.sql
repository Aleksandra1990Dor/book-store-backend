/*
  Warnings:

  - Added the required column `slug` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "slug" TEXT NOT NULL;
