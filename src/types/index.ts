export type DeckCategory =
  | 'ice-breaker'
  | 'pdkt'
  | 'pacaran'
  | 'ldr'
  | 'pra-nikah'
  | 'suami-istri'
  | 'konflik'
  | 'apresiasi'
  | 'masa-depan';

export type DeckColorVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'dark'
  | 'light';

export type Deck = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  description: string;
  shortDescription?: string;
  category: DeckCategory;
  cardCount: number;
  estimatedMinutes: number;
  estimatedDuration?: string;
  suitableFor?: string[];
  topics?: string[];
  isPremium: boolean;
  isRecommended?: boolean;
  colorVariant: DeckColorVariant;
  color?: string;
  icon?: string;
  coverIllustration?: string;
  sortOrder: number;
};

export type CardType = 'question' | 'wildcard';

export type CardTopic =
  | 'intro'
  | 'values'
  | 'family'
  | 'finance'
  | 'conflict'
  | 'future'
  | 'appreciation'
  | 'distance'
  | 'commitment'
  | 'intimacy';

export type CardSensitivity = 'low' | 'medium' | 'high';

export type CardPhase = 'opening' | 'warm' | 'core' | 'reflection';

export type ConversationCard = {
  id: string;
  deckId: string;
  type: CardType;
  topic: CardTopic;
  sensitivity: CardSensitivity;
  phase: CardPhase;
  content: string;
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type SessionStatus = 'active' | 'completed' | 'abandoned' | 'expired';

export type SessionMode = 'solo' | 'table' | 'multiplayer';

export type CardAction = 'viewed' | 'skipped' | 'favorited' | 'unfavorited';

export type SessionCardLog = {
  cardId: string;
  action: CardAction;
  shownAt: string;
};

export type CardSession = {
  id: string;
  deckId: string;
  mode: SessionMode;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  expiresAt?: string;
  currentCardId?: string;
  viewedCardIds: string[];
  skippedCardIds: string[];
  favoriteCardIds: string[];
  logs: SessionCardLog[];
};

export type TableCardState = {
  id: string;
  sessionId: string;
  cardId: string;
  position: number;
  isRevealed: boolean;
  revealedAt?: string;
  revealedByUserId?: string;
  card: ConversationCard;
};

export type TableSession = {
  id: string;
  deckId: string;
  mode: Extract<SessionMode, 'table'>;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  expiresAt?: string;
  deck: Deck;
  cards: TableCardState[];
};

export type MultiplayerRoomStatus = 'waiting' | 'active' | 'completed' | 'abandoned' | 'expired';

export type RoomPlayer = {
  id: string;
  roomId: string;
  userId?: string;
  displayName: string;
  role: 'host' | 'player';
  position: number;
  isActive: boolean;
  joinedAt: string;
};

export type RoomCardState = {
  id: string;
  roomId: string;
  cardId: string;
  position: number;
  isRevealed: boolean;
  revealedAt?: string;
  revealedByPlayerId?: string;
  revealedByPlayerName?: string;
  card: ConversationCard;
};

export type MultiplayerRoom = {
  id: string;
  code: string;
  deckId: string;
  hostUserId?: string;
  status: MultiplayerRoomStatus;
  currentTurnPlayerId?: string;
  turnIndex: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  endedAt?: string;
  expiresAt?: string;
  deck: Deck;
  players: RoomPlayer[];
  cards: RoomCardState[];
  latestRevealedCard?: RoomCardState | null;
  currentPlayerId?: string;
  currentPlayerRole?: RoomPlayer['role'];
  isCurrentUserHost?: boolean;
};

export type RelationshipType = 'partner' | 'pdkt' | 'friend' | 'family' | 'self';

export type RelationshipStage = 'new' | 'dating' | 'ldr' | 'engaged' | 'married';

export type PreferredTone = 'casual' | 'honest' | 'fun' | 'serious';

export type OnboardingPreference = {
  relationshipType?: RelationshipType;
  relationshipStage?: RelationshipStage;
  preferredTone?: PreferredTone;
  completedOnboarding: boolean;
};

export type AnonymousUser = {
  id: string;
  createdAt: string;
};

export type GuestData = {
  onboarding?: Partial<{
    playingWith: 'pasangan' | 'gebetan' | 'sahabat' | 'keluarga' | 'diri-sendiri';
    situation: 'baru-dekat' | 'pacaran' | 'ldr' | 'tunangan' | 'menikah';
    vibe: 'santai' | 'jujur' | 'seru' | 'serius';
    completedAt: number;
  }>;
  sessions?: Array<Partial<CardSession> & { currentCardIndex?: number; startedAt?: number | string; completedAt?: number }>;
  favoriteCardIds?: string[];
  lastDeckId?: string;
};
