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

export function getDeckListingCoverSrc(deckSlug: string): string {
  return DECK_LISTING_COVER_SOURCES[deckSlug];
}
