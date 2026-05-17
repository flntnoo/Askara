import { prisma } from '../lib/prisma';
import type { ConversationCard } from '../types';

export const PHASE_ORDER = ['opening', 'warm', 'core', 'reflection'] as const;

type DbCard = {
  id: string;
  deckId: string;
  type: string;
  topic: string;
  sensitivity: string;
  phase: string;
  content: string;
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
};

export function sortCardsByPhase<T extends { phase: string; sortOrder: number }>(cards: T[]): T[] {
  return [...cards].sort((a, b) => {
    const phaseA = PHASE_ORDER.indexOf(a.phase as (typeof PHASE_ORDER)[number]);
    const phaseB = PHASE_ORDER.indexOf(b.phase as (typeof PHASE_ORDER)[number]);
    const safePhaseA = phaseA === -1 ? PHASE_ORDER.length : phaseA;
    const safePhaseB = phaseB === -1 ? PHASE_ORDER.length : phaseB;

    if (safePhaseA !== safePhaseB) {
      return safePhaseA - safePhaseB;
    }

    return a.sortOrder - b.sortOrder;
  });
}

export function toConversationCard(card: DbCard): ConversationCard {
  return {
    id: card.id,
    deckId: card.deckId,
    type: card.type as ConversationCard['type'],
    topic: card.topic as ConversationCard['topic'],
    sensitivity: card.sensitivity as ConversationCard['sensitivity'],
    phase: card.phase as ConversationCard['phase'],
    content: card.content,
    isPremium: card.isPremium,
    isActive: card.isActive,
    sortOrder: card.sortOrder,
  };
}

export async function getCardsForDeck(deckId: string) {
  const cards = await prisma.card.findMany({
    where: {
      deckId,
      isActive: true,
    },
  });

  return sortCardsByPhase(cards).map(toConversationCard);
}

export async function getCardsForDeckSlug(slug: string) {
  const deck = await prisma.deck.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!deck) {
    return null;
  }

  return getCardsForDeck(deck.id);
}

export async function getNextCard(
  deckId: string,
  viewedCardIds: string[],
  skippedCardIds: string[],
) {
  const unavailableCardIds = new Set([...viewedCardIds, ...skippedCardIds]);
  const cards = await getCardsForDeck(deckId);

  return cards.find((card) => !unavailableCardIds.has(card.id)) ?? null;
}
