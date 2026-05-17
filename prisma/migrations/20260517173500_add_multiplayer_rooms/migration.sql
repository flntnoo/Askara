-- CreateTable
CREATE TABLE "MultiplayerRoom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "hostUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "currentTurnPlayerId" TEXT,
    "turnIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MultiplayerRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomPlayer" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT,
    "displayName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'player',
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomCard" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,
    "revealedByPlayerId" TEXT,
    "revealedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MultiplayerRoom_code_key" ON "MultiplayerRoom"("code");

-- CreateIndex
CREATE INDEX "MultiplayerRoom_deckId_idx" ON "MultiplayerRoom"("deckId");

-- CreateIndex
CREATE INDEX "MultiplayerRoom_hostUserId_idx" ON "MultiplayerRoom"("hostUserId");

-- CreateIndex
CREATE INDEX "MultiplayerRoom_status_idx" ON "MultiplayerRoom"("status");

-- CreateIndex
CREATE INDEX "MultiplayerRoom_currentTurnPlayerId_idx" ON "MultiplayerRoom"("currentTurnPlayerId");

-- CreateIndex
CREATE INDEX "RoomPlayer_roomId_idx" ON "RoomPlayer"("roomId");

-- CreateIndex
CREATE INDEX "RoomPlayer_userId_idx" ON "RoomPlayer"("userId");

-- CreateIndex
CREATE INDEX "RoomPlayer_roomId_isActive_idx" ON "RoomPlayer"("roomId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RoomPlayer_roomId_position_key" ON "RoomPlayer"("roomId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "RoomPlayer_roomId_userId_key" ON "RoomPlayer"("roomId", "userId");

-- CreateIndex
CREATE INDEX "RoomCard_roomId_isRevealed_idx" ON "RoomCard"("roomId", "isRevealed");

-- CreateIndex
CREATE INDEX "RoomCard_cardId_idx" ON "RoomCard"("cardId");

-- CreateIndex
CREATE INDEX "RoomCard_revealedByPlayerId_idx" ON "RoomCard"("revealedByPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomCard_roomId_cardId_key" ON "RoomCard"("roomId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomCard_roomId_position_key" ON "RoomCard"("roomId", "position");

-- AddForeignKey
ALTER TABLE "MultiplayerRoom" ADD CONSTRAINT "MultiplayerRoom_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerRoom" ADD CONSTRAINT "MultiplayerRoom_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerRoom" ADD CONSTRAINT "MultiplayerRoom_currentTurnPlayerId_fkey" FOREIGN KEY ("currentTurnPlayerId") REFERENCES "RoomPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomPlayer" ADD CONSTRAINT "RoomPlayer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "MultiplayerRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomPlayer" ADD CONSTRAINT "RoomPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomCard" ADD CONSTRAINT "RoomCard_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "MultiplayerRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomCard" ADD CONSTRAINT "RoomCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomCard" ADD CONSTRAINT "RoomCard_revealedByPlayerId_fkey" FOREIGN KEY ("revealedByPlayerId") REFERENCES "RoomPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
