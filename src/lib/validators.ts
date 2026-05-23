import { z } from 'zod';

export const deckCategorySchema = z.enum([
  'ice-breaker',
  'pdkt',
  'pacaran',
  'ldr',
  'pra-nikah',
  'suami-istri',
  'konflik',
  'apresiasi',
  'masa-depan',
]);

export const sessionStatusSchema = z.enum(['active', 'completed', 'abandoned', 'expired']);
export const cardActionSchema = z.enum(['viewed', 'skipped', 'favorited', 'unfavorited']);

export const createSessionSchema = z.object({
  deckId: z.string().min(1),
});

export const createTableSessionSchema = z.object({
  deckId: z.string().min(1),
});

export const revealTableCardSchema = z.object({
  sessionCardStateId: z.string().min(1),
});

export const createRoomSchema = z.object({
  deckId: z.string().min(1),
  displayName: z
    .string({ required_error: 'Display name is required' })
    .trim()
    .min(1, 'Display name is required')
    .max(40),
});

export const joinRoomSchema = z.object({
  deckId: z.string().min(1),
  displayName: z
    .string({ required_error: 'Display name is required' })
    .trim()
    .min(1, 'Display name is required')
    .max(40),
});

export const updateSessionSchema = z.object({
  status: sessionStatusSchema.optional(),
  currentCardId: z.string().min(1).nullable().optional(),
  endedAt: z.string().datetime().nullable().optional(),
});

export const sessionActionSchema = z.object({
  cardId: z.string().min(1),
  action: cardActionSchema,
});

export const favoriteSchema = z.object({
  cardId: z.string().min(1),
});

export const onboardingPreferenceSchema = z.object({
  relationshipType: z.enum(['partner', 'pdkt', 'friend', 'family', 'self']).optional(),
  relationshipStage: z.enum(['new', 'dating', 'ldr', 'engaged', 'married']).optional(),
  preferredTone: z.enum(['casual', 'honest', 'fun', 'serious']).optional(),
  completedOnboarding: z.boolean().default(false),
});

export const analyticsEventNameSchema = z.enum([
  'landing_viewed',
  'onboarding_started',
  'onboarding_step_completed',
  'onboarding_completed',
  'deck_library_viewed',
  'deck_viewed',
  'session_started',
  'card_viewed',
  'card_skipped',
  'card_favorited',
  'card_unfavorited',
  'session_completed',
  'favorites_viewed',
  'share_clicked',
  'premium_clicked',
]);

const analyticsEventSchema = z.object({
  name: analyticsEventNameSchema,
  timestamp: z.string().datetime().optional(),
  anonymousUserId: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

export const analyticsRequestSchema = z.union([
  analyticsEventSchema,
  z.array(analyticsEventSchema).min(1).max(50),
  z.object({
    events: z.array(analyticsEventSchema).min(1).max(50),
  }),
]);
