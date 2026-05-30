import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { CARDS } from '../src/data/cards';
import { DECKS } from '../src/data/decks';

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  return databaseUrl;
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getDatabaseUrl(),
  }),
});

async function main() {
  if (DECKS.length !== 9) {
    throw new Error(`Expected 9 decks, found ${DECKS.length}`);
  }

  if (CARDS.length !== 270) {
    throw new Error(`Expected 270 cards, found ${CARDS.length}`);
  }

  for (const deck of DECKS) {
    const actualCardCount = CARDS.filter((card) => card.deckId === deck.id).length;

    if (actualCardCount !== 30) {
      throw new Error(`Deck ${deck.id} expected 30 cards, found ${actualCardCount}`);
    }

    await prisma.deck.upsert({
      where: { slug: deck.slug },
      create: {
        id: deck.id,
        slug: deck.slug,
        name: deck.name,
        title: deck.title,
        description: deck.description,
        shortDescription: deck.shortDescription,
        category: deck.category,
        cardCount: actualCardCount,
        estimatedMinutes: deck.estimatedMinutes,
        estimatedDuration: deck.estimatedDuration,
        suitableFor: deck.suitableFor ?? [],
        topics: deck.topics ?? [],
        isPremium: deck.isPremium,
        isRecommended: deck.isRecommended ?? false,
        colorVariant: deck.colorVariant,
        color: deck.color,
        icon: deck.icon,
        coverIllustration: deck.coverIllustration,
        sortOrder: deck.sortOrder,
        isActive: true,
      },
      update: {
        name: deck.name,
        title: deck.title,
        description: deck.description,
        shortDescription: deck.shortDescription,
        category: deck.category,
        cardCount: actualCardCount,
        estimatedMinutes: deck.estimatedMinutes,
        estimatedDuration: deck.estimatedDuration,
        suitableFor: deck.suitableFor ?? [],
        topics: deck.topics ?? [],
        isPremium: deck.isPremium,
        isRecommended: deck.isRecommended ?? false,
        colorVariant: deck.colorVariant,
        color: deck.color,
        icon: deck.icon,
        coverIllustration: deck.coverIllustration,
        sortOrder: deck.sortOrder,
        isActive: true,
      },
    });
  }

  for (const card of CARDS) {
    await prisma.card.upsert({
      where: { id: card.id },
      create: {
        id: card.id,
        deckId: card.deckId,
        type: card.type,
        topic: card.topic,
        sensitivity: card.sensitivity,
        phase: card.phase,
        content: card.content,
        isPremium: card.isPremium,
        isActive: card.isActive,
        sortOrder: card.sortOrder,
      },
      update: {
        deckId: card.deckId,
        type: card.type,
        topic: card.topic,
        sensitivity: card.sensitivity,
        phase: card.phase,
        content: card.content,
        isPremium: card.isPremium,
        isActive: card.isActive,
        sortOrder: card.sortOrder,
      },
    });
  }

  const [deckCount, cardCount] = await Promise.all([
    prisma.deck.count(),
    prisma.card.count(),
  ]);

  console.log(`Seed complete: ${deckCount} decks, ${cardCount} cards`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
