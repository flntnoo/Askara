-- AlterTable
ALTER TABLE "Session" ADD COLUMN "mode" TEXT NOT NULL DEFAULT 'solo';

-- CreateTable
CREATE TABLE "SessionCardState" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,
    "revealedAt" TIMESTAMP(3),
    "revealedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionCardState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_mode_status_idx" ON "Session"("userId", "mode", "status");

-- CreateIndex
CREATE INDEX "SessionCardState_sessionId_isRevealed_idx" ON "SessionCardState"("sessionId", "isRevealed");

-- CreateIndex
CREATE INDEX "SessionCardState_cardId_idx" ON "SessionCardState"("cardId");

-- CreateIndex
CREATE INDEX "SessionCardState_revealedByUserId_idx" ON "SessionCardState"("revealedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionCardState_sessionId_cardId_key" ON "SessionCardState"("sessionId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionCardState_sessionId_position_key" ON "SessionCardState"("sessionId", "position");

-- AddForeignKey
ALTER TABLE "SessionCardState" ADD CONSTRAINT "SessionCardState_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionCardState" ADD CONSTRAINT "SessionCardState_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionCardState" ADD CONSTRAINT "SessionCardState_revealedByUserId_fkey" FOREIGN KEY ("revealedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
