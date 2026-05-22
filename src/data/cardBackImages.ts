export const TITIK_TEMU_DECK_ID = 'deck-ice-breaker';

const TITIK_TEMU_CARD_BACK_COUNT = 30;

export function getBoardCardBackImageSrc(deckId: string, position: number): string | undefined {
  if (
    deckId !== TITIK_TEMU_DECK_ID ||
    position < 0 ||
    position >= TITIK_TEMU_CARD_BACK_COUNT
  ) {
    return undefined;
  }

  const assetNumber = (position + 1).toString().padStart(2, '0');
  return `/assets/decks/titik-temu/cards/${assetNumber}.svg`;
}
