-- CreateEnum
CREATE TYPE "Funnel" AS ENUM ('HAIR_ANALYSIS', 'BOOK_APPOINTMENT');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "funnel" "Funnel" DEFAULT 'BOOK_APPOINTMENT';

-- AlterTable
ALTER TABLE "UserwithScore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "scheduled_call" DROP NOT NULL;

-- CreateTable
CREATE TABLE "analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "reportId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_userId_idx" ON "analysis"("userId");

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
