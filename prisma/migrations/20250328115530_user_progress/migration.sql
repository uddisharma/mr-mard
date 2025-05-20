-- DropIndex
DROP INDEX "UserProgress_userId_key";

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");
