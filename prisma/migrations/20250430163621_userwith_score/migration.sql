/*
  Warnings:

  - Added the required column `phoneNumber` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserwithScore" (
    "id" TEXT NOT NULL,
    "Score" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduled_call" TIMESTAMP(3) NOT NULL,
    "call_attempts" INTEGER NOT NULL,
    "call_note" TEXT,
    "lastStep" TEXT NOT NULL,
    "Status" TEXT NOT NULL,

    CONSTRAINT "UserwithScore_pkey" PRIMARY KEY ("id")
);
