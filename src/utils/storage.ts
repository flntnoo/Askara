import {
  AnonymousUser,
  CardSession,
  GuestData,
  OnboardingPreference,
  RelationshipStage,
  RelationshipType,
  PreferredTone,
} from '../types';
import { getDeckBySlug } from '../data/decks';

export const LEGACY_STORAGE_KEY = 'convo_guest_data';

export const STORAGE_KEYS = {
  anonymousUser: 'dcc_anonymous_user',
  onboarding: 'dcc_onboarding',
  activeSession: 'dcc_active_session',
  sessionHistory: 'dcc_session_history',
  favorites: 'dcc_favorites',
  settings: 'dcc_settings',
  roomPlayers: 'dcc_room_players',
} as const;

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const readKey = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  migrateLegacyStorageIfNeeded();
  return safeParseJson<T>(localStorage.getItem(key), fallback);
};

const writeKey = <T>(key: string, value: T): void => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

const removeKey = (key: string): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
};

const createId = (prefix: string) => {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);
  return `${prefix}_${randomPart}`;
};

const toIso = (value?: number | string): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  return new Date(value).toISOString();
};

const mapLegacyDeckId = (deckId?: string): string => {
  if (!deckId) return 'deck-ice-breaker';
  return getDeckBySlug(deckId)?.id ?? deckId;
};

const mapRelationshipType = (value?: string): RelationshipType | undefined => {
  const map: Record<string, RelationshipType> = {
    pasangan: 'partner',
    gebetan: 'pdkt',
    sahabat: 'friend',
    keluarga: 'family',
    'diri-sendiri': 'self',
  };
  return value ? map[value] : undefined;
};

const mapRelationshipStage = (value?: string): RelationshipStage | undefined => {
  const map: Record<string, RelationshipStage> = {
    'baru-dekat': 'new',
    pacaran: 'dating',
    ldr: 'ldr',
    tunangan: 'engaged',
    menikah: 'married',
  };
  return value ? map[value] : undefined;
};

const mapPreferredTone = (value?: string): PreferredTone | undefined => {
  const map: Record<string, PreferredTone> = {
    santai: 'casual',
    jujur: 'honest',
    seru: 'fun',
    serius: 'serious',
  };
  return value ? map[value] : undefined;
};

const migrateLegacySession = (session: NonNullable<GuestData['sessions']>[number]): CardSession => ({
  id: session.id ?? createId('session'),
  deckId: mapLegacyDeckId(session.deckId),
  mode: 'solo',
  status: session.status ?? 'completed',
  startedAt: toIso(session.startedAt),
  endedAt: session.endedAt ?? (session.completedAt ? toIso(session.completedAt) : undefined),
  currentCardId: session.currentCardId,
  viewedCardIds: session.viewedCardIds ?? [],
  skippedCardIds: session.skippedCardIds ?? [],
  favoriteCardIds: session.favoriteCardIds ?? [],
  logs: session.logs ?? [],
});

let didAttemptLegacyMigration = false;

export function migrateLegacyStorageIfNeeded(): void {
  if (!isBrowser() || didAttemptLegacyMigration) return;
  didAttemptLegacyMigration = true;

  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacyRaw) return;

  const legacy = safeParseJson<GuestData | null>(legacyRaw, null);
  if (!legacy) return;

  const hasNewData = Object.values(STORAGE_KEYS).some((key) => localStorage.getItem(key));
  if (hasNewData) return;

  const onboarding: OnboardingPreference | undefined = legacy.onboarding
    ? {
        relationshipType: mapRelationshipType(legacy.onboarding.playingWith),
        relationshipStage: mapRelationshipStage(legacy.onboarding.situation),
        preferredTone: mapPreferredTone(legacy.onboarding.vibe),
        completedOnboarding: Boolean(legacy.onboarding.completedAt),
      }
    : undefined;

  const sessions = (legacy.sessions ?? []).map(migrateLegacySession);
  const activeSession = sessions.find((session) => session.status === 'active') ?? null;
  const history = sessions.filter((session) => session.status !== 'active');

  if (onboarding) writeKey(STORAGE_KEYS.onboarding, onboarding);
  if (activeSession) writeKey(STORAGE_KEYS.activeSession, activeSession);
  writeKey(STORAGE_KEYS.sessionHistory, history);
  writeKey(STORAGE_KEYS.favorites, legacy.favoriteCardIds ?? []);
}

export function getOrCreateAnonymousUser(): AnonymousUser {
  const existing = readKey<AnonymousUser | null>(STORAGE_KEYS.anonymousUser, null);
  if (existing?.id) return existing;

  const user: AnonymousUser = {
    id: createId('anon'),
    createdAt: new Date().toISOString(),
  };
  writeKey(STORAGE_KEYS.anonymousUser, user);
  return user;
}

export function getOnboardingPreference(): OnboardingPreference | null {
  return readKey<OnboardingPreference | null>(STORAGE_KEYS.onboarding, null);
}

export function saveOnboardingPreference(preference: OnboardingPreference): void {
  getOrCreateAnonymousUser();
  writeKey(STORAGE_KEYS.onboarding, preference);
}

export function resetOnboarding(): void {
  removeKey(STORAGE_KEYS.onboarding);
}

export function getActiveSession(): CardSession | null {
  return readKey<CardSession | null>(STORAGE_KEYS.activeSession, null);
}

export function saveActiveSession(session: CardSession): void {
  writeKey(STORAGE_KEYS.activeSession, session);
}

export function clearActiveSession(): void {
  removeKey(STORAGE_KEYS.activeSession);
}

export function getSessionHistory(): CardSession[] {
  return readKey<CardSession[]>(STORAGE_KEYS.sessionHistory, []);
}

export function saveSessionHistory(sessions: CardSession[]): void {
  writeKey(STORAGE_KEYS.sessionHistory, sessions);
}

export function appendSessionHistory(session: CardSession): void {
  const history = getSessionHistory().filter((item) => item.id !== session.id);
  saveSessionHistory([session, ...history]);
}

export function getSession(sessionId: string): CardSession | null {
  const active = getActiveSession();
  if (active?.id === sessionId) return active;
  return getSessionHistory().find((session) => session.id === sessionId) ?? null;
}

export function getFavorites(): string[] {
  return readKey<string[]>(STORAGE_KEYS.favorites, []);
}

export function saveFavorites(cardIds: string[]): void {
  writeKey(STORAGE_KEYS.favorites, Array.from(new Set(cardIds)));
}

export function resetFavorites(): void {
  writeKey(STORAGE_KEYS.favorites, []);
}

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}

export function getSettings<T extends Record<string, unknown> = Record<string, unknown>>(): T {
  return readKey<T>(STORAGE_KEYS.settings, {} as T);
}

export function saveSettings<T extends Record<string, unknown>>(settings: T): void {
  writeKey(STORAGE_KEYS.settings, settings);
}

type JoinedRoomPlayer = {
  playerId: string;
  joinedAt: string;
};

type JoinedRoomPlayers = Record<string, JoinedRoomPlayer>;

const normalizeRoomCode = (code: string) => code.trim().toUpperCase();

export function getJoinedRoomPlayer(roomCode: string): JoinedRoomPlayer | null {
  const players = readKey<JoinedRoomPlayers>(STORAGE_KEYS.roomPlayers, {});
  return players[normalizeRoomCode(roomCode)] ?? null;
}

export function saveJoinedRoomPlayer(roomCode: string, playerId: string): void {
  if (!playerId) return;

  const players = readKey<JoinedRoomPlayers>(STORAGE_KEYS.roomPlayers, {});
  writeKey(STORAGE_KEYS.roomPlayers, {
    ...players,
    [normalizeRoomCode(roomCode)]: {
      playerId,
      joinedAt: new Date().toISOString(),
    },
  });
}
