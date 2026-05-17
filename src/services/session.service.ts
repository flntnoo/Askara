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
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  currentCardId: string | null;
  actions: SessionActionRecord[];
};

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
    status: session.status as CardSession['status'],
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString(),
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
  const session = await prisma.session.findFirst({
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

  const session = await prisma.session.create({
    data: {
      userId,
      deckId,
      status: 'active',
      currentCardId: firstCard?.id ?? null,
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
  await getOwnedSessionOrThrow(sessionId, userId);

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

  const session = await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.currentCardId !== undefined ? { currentCardId: data.currentCardId } : {}),
      ...(endedAt !== undefined ? { endedAt } : {}),
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

    const nextSession = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        currentCardId: nextCard?.id ?? null,
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

  return serialized;
}

export async function getActiveSession(userId: string) {
  const session = await prisma.session.findFirst({
    where: {
      userId,
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

  return session ? serializeSession(session) : null;
}

export async function getSessionHistory(userId: string) {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
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
