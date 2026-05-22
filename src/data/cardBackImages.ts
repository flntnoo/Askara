export const TITIK_TEMU_DECK_ID = 'deck-ice-breaker';
export const PERCIKAN_AWAL_DECK_ID = 'deck-pdkt';
export const MERAJUT_KISAH_DECK_ID = 'deck-pacaran';
export const JARAK_DAN_RINDU_DECK_ID = 'deck-ldr';
export const GERBANG_KOMITMEN_DECK_ID = 'deck-pra-nikah';
export const TEMAN_HIDUP_DECK_ID = 'deck-suami-istri';
export const BADAI_DAN_REDA_DECK_ID = 'deck-konflik';
export const MERAYAKAN_KITA_DECK_ID = 'deck-apresiasi';
export const MENATAP_ESOK_DECK_ID = 'deck-masa-depan';

type BoardCardBackConfig = {
  assetDirectory: string;
  cardBackCount: number;
  randomizeQuestions: boolean;
};

const BOARD_CARD_BACK_CONFIGS: Record<string, BoardCardBackConfig> = {
  [TITIK_TEMU_DECK_ID]: {
    assetDirectory: '/assets/decks/titik-temu/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [PERCIKAN_AWAL_DECK_ID]: {
    assetDirectory: '/assets/decks/percikan-awal/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [MERAJUT_KISAH_DECK_ID]: {
    assetDirectory: '/assets/decks/merajut-kisah/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [JARAK_DAN_RINDU_DECK_ID]: {
    assetDirectory: '/assets/decks/jarak-dan-rindu/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [GERBANG_KOMITMEN_DECK_ID]: {
    assetDirectory: '/assets/decks/gerbang-komitmen/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [TEMAN_HIDUP_DECK_ID]: {
    assetDirectory: '/assets/decks/teman-hidup/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [BADAI_DAN_REDA_DECK_ID]: {
    assetDirectory: '/assets/decks/badai-dan-reda/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [MERAYAKAN_KITA_DECK_ID]: {
    assetDirectory: '/assets/decks/merayakan-kita/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
  [MENATAP_ESOK_DECK_ID]: {
    assetDirectory: '/assets/decks/menatap-esok/cards',
    cardBackCount: 30,
    randomizeQuestions: true,
  },
};

export function getBoardCardBackImageSrc(deckId: string, position: number): string | undefined {
  const config = BOARD_CARD_BACK_CONFIGS[deckId];

  if (!config || position < 0 || position >= config.cardBackCount) {
    return undefined;
  }

  const assetNumber = (position + 1).toString().padStart(2, '0');
  return `${config.assetDirectory}/${assetNumber}.svg`;
}

export function shouldRandomizeBoardQuestions(deckId: string) {
  return Boolean(BOARD_CARD_BACK_CONFIGS[deckId]?.randomizeQuestions);
}
