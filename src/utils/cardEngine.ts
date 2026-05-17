import { CardPhase, ConversationCard } from '../types';

export const CARD_PHASE_ORDER: CardPhase[] = [
  'opening',
  'warm',
  'core',
  'reflection',
];

type GetNextCardParams = {
  deckId: string;
  allCards: ConversationCard[];
  viewedCardIds: string[];
  skippedCardIds: string[];
};

const getPhaseRank = (phase: CardPhase): number => CARD_PHASE_ORDER.indexOf(phase);

export function getNextCard({
  deckId,
  allCards,
  viewedCardIds,
  skippedCardIds,
}: GetNextCardParams): ConversationCard | null {
  const viewed = new Set(viewedCardIds);
  const skipped = new Set(skippedCardIds);

  return (
    allCards
      .filter((card) => card.deckId === deckId)
      .filter((card) => card.isActive)
      .filter((card) => !viewed.has(card.id))
      .filter((card) => !skipped.has(card.id))
      .sort((a, b) => {
        const phaseDiff = getPhaseRank(a.phase) - getPhaseRank(b.phase);
        if (phaseDiff !== 0) return phaseDiff;
        return a.sortOrder - b.sortOrder;
      })[0] ?? null
  );
}
