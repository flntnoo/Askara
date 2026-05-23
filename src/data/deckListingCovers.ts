const DECK_LISTING_COVER_SOURCES: Record<string, string> = {
  'ice-breaker': '/assets/decks/titik-temu/titik_temu_logo.png',
  pdkt: '/assets/decks/percikan-awal/percikan_awal_logo.png',
  pacaran: '/assets/decks/merajut-kisah/merajut_kisah_logo.png',
  ldr: '/assets/decks/jarak-dan-rindu/jarak_dan_rindu_logo.png',
  'pra-nikah': '/assets/decks/gerbang-komitmen/gerbang_komitmen_logo.png',
  'suami-istri': '/assets/decks/teman-hidup/teman_hidup_logo.png',
  konflik: '/assets/decks/badai-dan-reda/badai_dan_reda_logo.png',
  apresiasi: '/assets/decks/merayakan-kita/merayakan_kita_logo.png',
  'masa-depan': '/assets/decks/menatap-esok/menatap_esok_logo.png',
};

const DECK_COMPLETION_BADGE_SOURCES: Record<string, string> = {
  'ice-breaker': '/assets/decks/titik-temu/completion_badge.png',
  pdkt: '/assets/decks/percikan-awal/completion_badge.png',
  pacaran: '/assets/decks/merajut-kisah/completion_badge.png',
  ldr: '/assets/decks/jarak-dan-rindu/completion_badge.png',
  'pra-nikah': '/assets/decks/gerbang-komitmen/completion_badge.png',
  'suami-istri': '/assets/decks/teman-hidup/completion_badge.png',
  konflik: '/assets/decks/badai-dan-reda/completion_badge.png',
  apresiasi: '/assets/decks/merayakan-kita/completion_badge.png',
  'masa-depan': '/assets/decks/menatap-esok/completion_badge.png',
};

export function getDeckListingCoverSrc(deckSlug: string): string {
  return DECK_LISTING_COVER_SOURCES[deckSlug];
}

export function getDeckCompletionBadgeSrc(deckSlug: string): string {
  return DECK_COMPLETION_BADGE_SOURCES[deckSlug];
}
