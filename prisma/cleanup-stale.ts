import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const WAITING_ROOM_TTL_MS = 60 * 60 * 1000;
const ACTIVE_INACTIVITY_TTL_MS = 24 * 60 * 60 * 1000;

function subtractMs(now: Date, ms: number) {
  return new Date(now.getTime() - ms);
}

function parseDeleteAfterDays() {
  const rawValue = process.env.STALE_CLEANUP_DELETE_AFTER_DAYS;

  if (!rawValue) {
    return null;
  }

  const value = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('STALE_CLEANUP_DELETE_AFTER_DAYS must be a positive integer');
  }

  return value;
}

async function main() {
  const now = new Date();
  const waitingRoomCutoff = subtractMs(now, WAITING_ROOM_TTL_MS);
  const activeCutoff = subtractMs(now, ACTIVE_INACTIVITY_TTL_MS);
  const deleteAfterDays = parseDeleteAfterDays();

  const expiredWaitingRooms = await prisma.multiplayerRoom.updateMany({
    where: {
      status: 'waiting',
      OR: [
        {
          expiresAt: {
            lte: now,
          },
        },
        {
          expiresAt: null,
          createdAt: {
            lte: waitingRoomCutoff,
          },
        },
      ],
    },
    data: {
      status: 'expired',
      endedAt: now,
    },
  });

  const abandonedActiveRooms = await prisma.multiplayerRoom.updateMany({
    where: {
      status: 'active',
      OR: [
        {
          expiresAt: {
            lte: now,
          },
        },
        {
          expiresAt: null,
          updatedAt: {
            lte: activeCutoff,
          },
        },
      ],
    },
    data: {
      status: 'abandoned',
      endedAt: now,
      currentTurnPlayerId: null,
    },
  });

  const expiredSessions = await prisma.cardSession.updateMany({
    where: {
      status: 'active',
      expiresAt: {
        lte: now,
      },
    },
    data: {
      status: 'expired',
      endedAt: now,
      expiresAt: null,
    },
  });

  const abandonedSessions = await prisma.cardSession.updateMany({
    where: {
      status: 'active',
      expiresAt: null,
      updatedAt: {
        lte: activeCutoff,
      },
    },
    data: {
      status: 'abandoned',
      endedAt: now,
    },
  });

  let deletedRooms = 0;
  let deletedSessions = 0;

  if (deleteAfterDays) {
    const deleteCutoff = subtractMs(now, deleteAfterDays * 24 * 60 * 60 * 1000);

    const deletedRoomResult = await prisma.multiplayerRoom.deleteMany({
      where: {
        status: {
          in: ['expired', 'abandoned'],
        },
        endedAt: {
          lte: deleteCutoff,
        },
      },
    });

    const deletedSessionResult = await prisma.cardSession.deleteMany({
      where: {
        status: {
          in: ['expired', 'abandoned'],
        },
        endedAt: {
          lte: deleteCutoff,
        },
      },
    });

    deletedRooms = deletedRoomResult.count;
    deletedSessions = deletedSessionResult.count;
  }

  console.log(
    JSON.stringify(
      {
        expiredWaitingRooms: expiredWaitingRooms.count,
        abandonedActiveRooms: abandonedActiveRooms.count,
        expiredSessions: expiredSessions.count,
        abandonedSessions: abandonedSessions.count,
        deletedRooms,
        deletedSessions,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
