import { ApiError } from '../lib/api-response';
import { prisma } from '../lib/prisma';
import type { Deck, TableSession } from '../types';
import { sortCardsByPhase, toConversationCard } from './card.service';

type TableSessionRecord = Awaited<ReturnType<typeof getOwnedTableSessionOrThrow>>;

const ACTIVE_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getActiveSessionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + ACTIVE_SESSION_TTL_MS);
}

function isPast(date: Date | null | undefined, now = new Date()) {
  return Boolean(date && date <= now);
}

function serializeDeck(deck: TableSessionRecord['deck']): Deck {
  return {
    id: deck.id,
    slug: deck.slug,
    name: deck.name,
    title: deck.title ?? undefined,
    description: deck.description,
    shortDescription: deck.shortDescription ?? undefined,
    category: deck.category as Deck['category'],
    cardCount: deck.cardCount,
    estimatedMinutes: deck.estimatedMinutes,
    estimatedDuration: deck.estimatedDuration ?? undefined,
    suitableFor: deck.suitableFor,
    topics: deck.topics,
    isPremium: deck.isPremium,
    isRecommended: deck.isRecommended,
    colorVariant: deck.colorVariant as Deck['colorVariant'],
    color: deck.color ?? undefined,
    icon: deck.icon ?? undefined,
    coverIllustration: deck.coverIllustration ?? undefined,
    sortOrder: deck.sortOrder,
  };
}

function serializeTableSession(session: TableSessionRecord): TableSession {
  return {
    id: session.id,
    deckId: session.deckId,
    mode: 'table',
    status: session.status as TableSession['status'],
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString(),
    expiresAt: session.expiresAt?.toISOString(),
    deck: serializeDeck(session.deck),
    cards: session.cardStates.map((state) => ({
      id: state.id,
      sessionId: state.sessionId,
      cardId: state.cardId,
      position: state.position,
      isRevealed: state.isRevealed,
      revealedAt: state.revealedAt?.toISOString(),
      revealedByUserId: state.revealedByUserId ?? undefined,
      card: toConversationCard(state.card),
    })),
  };
}

async function getOwnedTableSessionOrThrow(sessionId: string, userId: string) {
  const session = await prisma.cardSession.findFirst({
    where: {
      id: sessionId,
      userId,
      mode: 'table',
    },
    include: {
      deck: true,
      cardStates: {
        orderBy: {
          position: 'asc',
        },
        include: {
          card: true,
        },
      },
    },
  });

  if (!session) {
    throw new ApiError(404, 'Table session not found');
  }

  return session;
}

export async function createTableSession(userId: string, deckId: string) {
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      isActive: true,
    },
    include: {
      cards: {
        where: {
          isActive: true,
        },
      },
    },
  });

  if (!deck) {
    throw new ApiError(404, 'Deck not found');
  }

  const cards = sortCardsByPhase(deck.cards);

  if (cards.length === 0) {
    throw new ApiError(409, 'Deck has no playable cards');
  }

  const session = await prisma.cardSession.create({
    data: {
      userId,
      deckId,
      mode: 'table',
      status: 'active',
      expiresAt: getActiveSessionExpiresAt(),
      cardStates: {
        create: cards.map((card, position) => ({
          cardId: card.id,
          position,
        })),
      },
    },
  });

  return getTableSession(session.id, userId);
}

export async function getTableSession(sessionId: string, userId: string) {
  const session = await getOwnedTableSessionOrThrow(sessionId, userId);
  return serializeTableSession(session);
}

export async function revealTableCard(
  sessionId: string,
  userId: string,
  sessionCardStateId: string,
) {
  const session = await prisma.cardSession.findFirst({
    where: {
      id: sessionId,
      userId,
      mode: 'table',
    },
    select: {
      id: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!session) {
    throw new ApiError(404, 'Table session not found');
  }

  if (session.status !== 'active') {
    throw new ApiError(409, 'Table session is not active');
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
    throw new ApiError(410, 'Table session has expired');
  }

  const state = await prisma.sessionCardState.findFirst({
    where: {
      id: sessionCardStateId,
      sessionId,
    },
    select: {
      id: true,
      isRevealed: true,
      cardId: true,
    },
  });

  if (!state) {
    throw new ApiError(404, 'Card state not found for this table session');
  }

  if (!state.isRevealed) {
    await prisma.$transaction([
      prisma.sessionCardState.update({
        where: {
          id: state.id,
        },
        data: {
          isRevealed: true,
          revealedAt: new Date(),
          revealedByUserId: userId,
        },
      }),
      prisma.cardSession.update({
        where: {
          id: sessionId,
        },
        data: {
          currentCardId: state.cardId,
          expiresAt: getActiveSessionExpiresAt(now),
        },
      }),
    ]);
  } else {
    await prisma.cardSession.update({
      where: {
        id: sessionId,
      },
      data: {
        expiresAt: getActiveSessionExpiresAt(now),
      },
    });
  }

  return getTableSession(sessionId, userId);
}

export async function endTableSession(sessionId: string, userId: string) {
  await getOwnedTableSessionOrThrow(sessionId, userId);

  await prisma.cardSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: 'completed',
      endedAt: new Date(),
      expiresAt: null,
    },
  });

  return getTableSession(sessionId, userId);
}
