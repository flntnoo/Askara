-- AlterTable
ALTER TABLE "Session" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MultiplayerRoom" ADD COLUMN "startedAt" TIMESTAMP(3);
ALTER TABLE "MultiplayerRoom" ADD COLUMN "endedAt" TIMESTAMP(3);
ALTER TABLE "MultiplayerRoom" ADD COLUMN "expiresAt" TIMESTAMP(3);

-- Backfill lifecycle deadlines for existing open records.
UPDATE "Session"
SET "expiresAt" = "startedAt" + INTERVAL '24 hours'
WHERE "status" = 'active' AND "expiresAt" IS NULL;

UPDATE "MultiplayerRoom"
SET "expiresAt" = "createdAt" + INTERVAL '1 hour'
WHERE "status" = 'waiting' AND "expiresAt" IS NULL;

UPDATE "MultiplayerRoom"
SET
    "startedAt" = COALESCE("startedAt", "updatedAt"),
    "expiresAt" = COALESCE("expiresAt", "updatedAt" + INTERVAL '24 hours')
WHERE "status" = 'active';

UPDATE "MultiplayerRoom"
SET "endedAt" = COALESCE("endedAt", "updatedAt")
WHERE "status" IN ('completed', 'abandoned', 'expired');

UPDATE "Session"
SET "endedAt" = COALESCE("endedAt", "updatedAt")
WHERE "status" IN ('completed', 'abandoned', 'expired') AND "endedAt" IS NULL;

-- CreateIndex
CREATE INDEX "Session_status_expiresAt_idx" ON "Session"("status", "expiresAt");
CREATE INDEX "Session_status_updatedAt_idx" ON "Session"("status", "updatedAt");
CREATE INDEX "MultiplayerRoom_status_expiresAt_idx" ON "MultiplayerRoom"("status", "expiresAt");
CREATE INDEX "MultiplayerRoom_status_updatedAt_idx" ON "MultiplayerRoom"("status", "updatedAt");
