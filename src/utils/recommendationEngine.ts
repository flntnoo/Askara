import { Deck, OnboardingPreference } from '../types';

const DEFAULT_SLUGS = ['ice-breaker', 'pdkt', 'apresiasi'];

export function getRecommendedDecks(
  decks: Deck[],
  preference?: OnboardingPreference | null
): Deck[] {
  const stageMap: Record<string, string[]> = {
    engaged: ['pra-nikah', 'masa-depan', 'konflik'],
    ldr: ['ldr', 'apresiasi', 'masa-depan'],
    married: ['suami-istri', 'apresiasi', 'konflik'],
  };

  const typeMap: Record<string, string[]> = {
    pdkt: ['pdkt', 'ice-breaker', 'apresiasi'],
    friend: ['ice-breaker', 'apresiasi'],
    family: ['ice-breaker', 'apresiasi'],
    self: ['ice-breaker', 'masa-depan'],
  };

  const slugs =
    (preference?.relationshipStage && stageMap[preference.relationshipStage]) ||
    (preference?.relationshipType && typeMap[preference.relationshipType]) ||
    DEFAULT_SLUGS;

  const bySlug = new Map(decks.map((deck) => [deck.slug, deck]));
  return slugs.map((slug) => bySlug.get(slug)).filter((deck): deck is Deck => Boolean(deck));
}
