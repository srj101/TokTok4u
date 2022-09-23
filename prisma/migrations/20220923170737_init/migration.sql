/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `YoutubeApi` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "TicketFile" ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "YoutubeApi";

-- CreateTable
CREATE TABLE "Youtubesettings" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientid" TEXT NOT NULL,
    "clientsecret" TEXT NOT NULL,
    "privacy" TEXT NOT NULL,

    CONSTRAINT "Youtubesettings_pkey" PRIMARY KEY ("id")
);
