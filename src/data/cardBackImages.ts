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
  cardBackImageSrc: string;
  randomizeQuestions: boolean;
};

const BOARD_CARD_BACK_CONFIGS: Record<string, BoardCardBackConfig> = {
  [TITIK_TEMU_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/titik-temu/titik_temu_back.webp',
    randomizeQuestions: true,
  },
  [PERCIKAN_AWAL_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/percikan-awal/percikan_awal_back.webp',
    randomizeQuestions: true,
  },
  [MERAJUT_KISAH_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/merajut-kisah/merajut_kisah_back.webp',
    randomizeQuestions: true,
  },
  [JARAK_DAN_RINDU_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/jarak-dan-rindu/jarak_dan_rindu_back.webp',
    randomizeQuestions: true,
  },
  [GERBANG_KOMITMEN_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/gerbang-komitmen/gerbang_komitmen_back.webp',
    randomizeQuestions: true,
  },
  [TEMAN_HIDUP_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/teman-hidup/teman_hidup_back.webp',
    randomizeQuestions: true,
  },
  [BADAI_DAN_REDA_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/badai-dan-reda/badai_dan_reda_back.webp',
    randomizeQuestions: true,
  },
  [MERAYAKAN_KITA_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/merayakan-kita/merayakan_kita_back.webp',
    randomizeQuestions: true,
  },
  [MENATAP_ESOK_DECK_ID]: {
    cardBackImageSrc: '/assets/decks/menatap-esok/menatap_esok_back.webp',
    randomizeQuestions: true,
  },
};

export function getBoardCardBackImageSrc(deckId: string): string | undefined {
  return BOARD_CARD_BACK_CONFIGS[deckId]?.cardBackImageSrc;
}

export function shouldRandomizeBoardQuestions(deckId: string) {
  return Boolean(BOARD_CARD_BACK_CONFIGS[deckId]?.randomizeQuestions);
}
