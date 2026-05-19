import { ApiError } from '../lib/api-response';
import { prisma } from '../lib/prisma';
import type { CardAction, CardSession } from '../types';
import { getNextCard } from './card.service';

type SessionActionRecord = {
  cardId: string;
  action: string;
  shownAt: Date;
};

type SessionRecord = {
  id: string;
  deckId: string;
  mode: string;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  expiresAt: Date | null;
  currentCardId: string | null;
  actions: SessionActionRecord[];
};

const ACTIVE_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getActiveSessionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + ACTIVE_SESSION_TTL_MS);
}

function isPast(date: Date | null | undefined, now = new Date()) {
  return Boolean(date && date <= now);
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function deriveFavoriteCardIds(actions: SessionActionRecord[]) {
  const favorites = new Set<string>();

  for (const item of actions) {
    if (item.action === 'favorited') {
      favorites.add(item.cardId);
    }

    if (item.action === 'unfavorited') {
      favorites.delete(item.cardId);
    }
  }

  return Array.from(favorites);
}

export function serializeSession(session: SessionRecord): CardSession {
  return {
    id: session.id,
    deckId: session.deckId,
    mode: session.mode as CardSession['mode'],
    status: session.status as CardSession['status'],
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString(),
    expiresAt: session.expiresAt?.toISOString(),
    currentCardId: session.currentCardId ?? undefined,
    viewedCardIds: unique(
      session.actions.filter((item) => item.action === 'viewed').map((item) => item.cardId),
    ),
    skippedCardIds: unique(
      session.actions.filter((item) => item.action === 'skipped').map((item) => item.cardId),
    ),
    favoriteCardIds: deriveFavoriteCardIds(session.actions),
    logs: session.actions.map((item) => ({
      cardId: item.cardId,
      action: item.action as CardAction,
      shownAt: item.shownAt.toISOString(),
    })),
  };
}

async function getOwnedSessionOrThrow(sessionId: string, userId: string) {
  const session = await prisma.cardSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
}

export async function createSession(userId: string, deckId: string) {
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      isActive: true,
    },
  });

  if (!deck) {
    throw new ApiError(404, 'Deck not found');
  }

  const firstCard = await getNextCard(deckId, [], []);

  const session = await prisma.cardSession.create({
    data: {
      userId,
      deckId,
      mode: 'solo',
      status: 'active',
      currentCardId: firstCard?.id ?? null,
      expiresAt: getActiveSessionExpiresAt(),
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  return serializeSession(session);
}

export async function getSession(sessionId: string, userId: string) {
  const session = await getOwnedSessionOrThrow(sessionId, userId);
  return serializeSession(session);
}

export async function updateSession(
  sessionId: string,
  userId: string,
  data: {
    status?: string;
    currentCardId?: string | null;
    endedAt?: string | null;
  },
) {
  const existingSession = await getOwnedSessionOrThrow(sessionId, userId);

  if (data.currentCardId) {
    const card = await prisma.card.findFirst({
      where: {
        id: data.currentCardId,
        isActive: true,
      },
    });

    if (!card) {
      throw new ApiError(404, 'Current card not found');
    }
  }

  const endedAt =
    data.endedAt === null
      ? null
      : data.endedAt
        ? new Date(data.endedAt)
        : data.status && data.status !== 'active'
          ? new Date()
          : undefined;
  const expiresAt =
    data.status && data.status !== 'active'
      ? null
      : data.status === 'active' || (existingSession.status === 'active' && data.currentCardId !== undefined)
        ? getActiveSessionExpiresAt()
        : undefined;

  const session = await prisma.cardSession.update({
    where: {
      id: sessionId,
    },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.currentCardId !== undefined ? { currentCardId: data.currentCardId } : {}),
      ...(endedAt !== undefined ? { endedAt } : {}),
      ...(expiresAt !== undefined ? { expiresAt } : {}),
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  return serializeSession(session);
}

export async function logSessionAction(
  sessionId: string,
  userId: string,
  data: {
    cardId: string;
    action: CardAction;
  },
) {
  const session = await getOwnedSessionOrThrow(sessionId, userId);

  if (session.status !== 'active') {
    throw new ApiError(409, 'Session is not active');
  }

  const now = new Date();

  if (isPast(session.expiresAt, now)) {
    await prisma.cardSession.updateMany({
      where: {
        id: session.id,
        status: 'active',
      },
      data: {
        status: 'expired',
        endedAt: now,
        expiresAt: null,
      },
    });
    throw new ApiError(410, 'Session has expired');
  }

  const card = await prisma.card.findFirst({
    where: {
      id: data.cardId,
      deckId: session.deckId,
      isActive: true,
    },
  });

  if (!card) {
    throw new ApiError(404, 'Card not found for this session deck');
  }

  await prisma.sessionAction.create({
    data: {
      sessionId,
      cardId: data.cardId,
      action: data.action,
    },
  });

  if (data.action === 'favorited') {
    await prisma.favorite.upsert({
      where: {
        userId_cardId: {
          userId,
          cardId: data.cardId,
        },
      },
      create: {
        userId,
        cardId: data.cardId,
      },
      update: {},
    });
  }

  if (data.action === 'unfavorited') {
    await prisma.favorite.deleteMany({
      where: {
        userId,
        cardId: data.cardId,
      },
    });
  }

  const updatedSession = await getOwnedSessionOrThrow(sessionId, userId);
  const serialized = serializeSession(updatedSession);

  if (data.action === 'viewed' || data.action === 'skipped') {
    const nextCard = await getNextCard(
      session.deckId,
      serialized.viewedCardIds,
      serialized.skippedCardIds,
    );

    const nextSession = await prisma.cardSession.update({
      where: {
        id: sessionId,
      },
      data: {
        currentCardId: nextCard?.id ?? null,
        expiresAt: getActiveSessionExpiresAt(now),
      },
      include: {
        actions: {
          orderBy: {
            shownAt: 'asc',
          },
        },
      },
    });

    return serializeSession(nextSession);
  }

  const refreshedSession = await prisma.cardSession.update({
    where: {
      id: sessionId,
    },
    data: {
      expiresAt: getActiveSessionExpiresAt(now),
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  return serializeSession(refreshedSession);
}

export async function getActiveSession(userId: string) {
  const session = await prisma.cardSession.findFirst({
    where: {
      userId,
      mode: 'solo',
      status: 'active',
    },
    orderBy: {
      startedAt: 'desc',
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  if (session && isPast(session.expiresAt)) {
    await prisma.cardSession.updateMany({
      where: {
        id: session.id,
        status: 'active',
      },
      data: {
        status: 'expired',
        endedAt: new Date(),
        expiresAt: null,
      },
    });
    return null;
  }

  return session ? serializeSession(session) : null;
}

export async function getSessionHistory(userId: string) {
  const sessions = await prisma.cardSession.findMany({
    where: {
      userId,
      mode: 'solo',
      status: {
        not: 'active',
      },
    },
    orderBy: {
      startedAt: 'desc',
    },
    include: {
      actions: {
        orderBy: {
          shownAt: 'asc',
        },
      },
    },
  });

  return sessions.map(serializeSession);
}

