import { ApiError } from '../lib/api-response';
import { prisma } from '../lib/prisma';

export async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      card: {
        include: {
          deck: true,
        },
      },
    },
  });

  return {
    cardIds: favorites.map((favorite) => favorite.cardId),
    cards: favorites.map((favorite) => favorite.card),
  };
}

export async function addFavorite(userId: string, cardId: string) {
  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      isActive: true,
    },
  });

  if (!card) {
    throw new ApiError(404, 'Card not found');
  }

  await prisma.favorite.upsert({
    where: {
      userId_cardId: {
        userId,
        cardId,
      },
    },
    create: {
      userId,
      cardId,
    },
    update: {},
  });

  return getFavorites(userId);
}

export async function removeFavorite(userId: string, cardId: string) {
  await prisma.favorite.deleteMany({
    where: {
      userId,
      cardId,
    },
  });

  return getFavorites(userId);
}

export async function clearFavorites(userId: string) {
  await prisma.favorite.deleteMany({
    where: {
      userId,
    },
  });

  return getFavorites(userId);
}
