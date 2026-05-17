import { prisma } from '../lib/prisma';
import { getCardsForDeckSlug, sortCardsByPhase, toConversationCard } from './card.service';

export async function getAllDecks(category?: string) {
  return prisma.deck.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
}

export async function getDeckBySlug(slug: string) {
  return prisma.deck.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      _count: {
        select: {
          cards: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });
}

export async function getDeckWithPreview(slug: string, previewCount = 3) {
  const deck = await prisma.deck.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      cards: {
        where: {
          isActive: true,
        },
      },
      _count: {
        select: {
          cards: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!deck) {
    return null;
  }

  const cards = sortCardsByPhase(deck.cards).map(toConversationCard);

  return {
    ...deck,
    cards: undefined,
    cardCount: deck._count.cards,
    previewCards: cards.slice(0, previewCount),
  };
}

export { getCardsForDeckSlug };
