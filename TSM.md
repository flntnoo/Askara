# Technical Specification & System Mapping (TSM)
## Digital Conversation Card App

---

## 1. Document Info

| Item | Detail |
|---|---|
| Product Name | TBD |
| Document Type | Technical Specification & System Mapping |
| Version | v1.0 |
| Platform | Web App / PWA |
| Target Release | MVP |
| Product Direction | Deck-based digital conversation card app |
| Login Strategy | Guest-first |
| Level Selection | Not included |
| Design System | Vibrant Operator |
| Status | Draft |

---

## 2. Purpose

Dokumen TSM ini dibuat untuk menjembatani PRD ke implementasi teknis.

TSM menjelaskan bagaimana aplikasi dibangun dari sisi:

- Frontend architecture
- Routing
- Data model
- Local storage
- State management
- Session flow
- Card engine
- Onboarding logic
- Recommendation logic
- Component mapping
- PWA requirements
- Analytics events
- Error states
- Development milestones

---

## 3. Technical Summary

Aplikasi ini adalah web/PWA kartu obrolan digital yang bisa digunakan langsung dari browser tanpa login.

MVP akan menggunakan pendekatan **frontend-first**:

```txt
Next.js Frontend
↓
Static Deck & Card Data
↓
Zustand State Management
↓
Local Storage Persistence
↓
PWA-ready Experience
```

Untuk MVP awal, backend belum wajib. Semua data deck dan kartu bisa disimpan sebagai file TypeScript/JSON lokal. Session, onboarding preference, dan favorite cards disimpan di local storage.

Backend, database, auth, payment, dan admin panel baru ditambahkan setelah produk tervalidasi.

---

## 4. Technical Principles

### 4.1 Guest-First

User harus bisa mencoba produk tanpa login.

```txt
No login before onboarding
No login before play
No login before favorite
```

### 4.2 Deck-Based, Not Level-Based

Tidak ada level selection.

User memilih deck, lalu sistem mengatur urutan kartu berdasarkan metadata internal:

```txt
phase
topic
sensitivity
sortOrder
```

### 4.3 One Card at a Time

Play screen hanya menampilkan satu kartu utama dalam satu waktu.

Tidak boleh ada:

- Bottom navigation
- Iklan
- Social feed
- Score hubungan
- Statistik berat
- Rekomendasi deck lain

### 4.4 Local-First MVP

MVP harus bisa berjalan dengan data lokal:

- Decks dari file lokal
- Cards dari file lokal
- Session dari state lokal
- Persistence via localStorage

### 4.5 Easy to Migrate

Struktur data dan service harus dibuat agar mudah dipindahkan ke backend/database nanti.

---

## 5. Recommended Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State Management | Zustand |
| Persistence | localStorage |
| Icons | Lucide React |
| PWA | next-pwa or custom service worker |
| Deployment | Vercel |
| Backend MVP | Not required |
| Database MVP | Not required |
| Auth MVP | Not required |

---

## 6. Architecture Overview

### 6.1 MVP Architecture

```txt
User Browser / Mobile Browser
        ↓
Next.js App Router
        ↓
Page Components
        ↓
Feature Components
        ↓
Zustand Store
        ↓
Static Data Files
        ↓
localStorage Persistence
```

### 6.2 Future Architecture

```txt
User Browser / PWA
        ↓
Next.js Frontend
        ↓
API Routes / Backend API
        ↓
Database
        ↓
Auth Provider
        ↓
Payment Provider
        ↓
Admin Content Panel
```

---

## 7. App Routes

### 7.1 MVP Routes

```txt
/
├── /onboarding
├── /home
├── /decks
│   └── /decks/[slug]
├── /play/[sessionId]
├── /summary/[sessionId]
├── /favorites
└── /settings
```

### 7.2 Post-MVP Routes

```txt
/share/[cardId]
/premium
/auth
/profile
/rooms/[code]
/admin
```

---

## 8. Route Responsibilities

| Route | Purpose | Priority |
|---|---|---|
| `/` | Landing page | P0 |
| `/onboarding` | User context setup | P0 |
| `/home` | Deck launcher | P0 |
| `/decks` | Deck library | P0 |
| `/decks/[slug]` | Deck detail | P0 |
| `/play/[sessionId]` | Main card play experience | P0 |
| `/summary/[sessionId]` | Session result/closure | P0 |
| `/favorites` | Saved cards | P0 |
| `/settings` | Preferences/reset data | P1 |
| `/share/[cardId]` | Share card preview | P1 |
| `/premium` | Premium deck offering | P2 |
| `/rooms/[code]` | Play Together multiplayer room | P1 |
| `/admin` | Content management | P2 |

---

## 9. Frontend Folder Structure

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   │
│   ├── onboarding/
│   │   └── page.tsx
│   │
│   ├── home/
│   │   └── page.tsx
│   │
│   ├── decks/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── play/
│   │   └── [sessionId]/
│   │       └── page.tsx
│   │
│   ├── summary/
│   │   └── [sessionId]/
│   │       └── page.tsx
│   │
│   ├── favorites/
│   │   └── page.tsx
│   │
│   ├── settings/
│   │   └── page.tsx
│   │
│   ├── share/
│   │   └── [cardId]/
│   │       └── page.tsx
│   │
│   └── premium/
│       └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── chip.tsx
│   │   ├── icon-button.tsx
│   │   ├── bottom-sheet.tsx
│   │   ├── modal.tsx
│   │   ├── progress.tsx
│   │   └── toast.tsx
│   │
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── mobile-container.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── page-header.tsx
│   │   └── play-shell.tsx
│   │
│   ├── onboarding/
│   │   ├── onboarding-step.tsx
│   │   ├── option-card.tsx
│   │   └── onboarding-progress.tsx
│   │
│   ├── decks/
│   │   ├── deck-card.tsx
│   │   ├── deck-grid.tsx
│   │   ├── deck-detail-hero.tsx
│   │   ├── deck-meta.tsx
│   │   └── deck-preview-card.tsx
│   │
│   ├── cards/
│   │   ├── question-card.tsx
│   │   ├── wildcard-card.tsx
│   │   ├── card-actions.tsx
│   │   ├── favorite-button.tsx
│   │   ├── skip-button.tsx
│   │   └── share-card-preview.tsx
│   │
│   ├── session/
│   │   ├── session-summary-card.tsx
│   │   ├── pause-session-sheet.tsx
│   │   ├── end-session-dialog.tsx
│   │   └── empty-deck-state.tsx
│   │
│   └── premium/
│       ├── premium-badge.tsx
│       ├── premium-deck-card.tsx
│       └── paywall-sheet.tsx
│
├── features/
│   ├── onboarding/
│   │   ├── onboarding-store.ts
│   │   ├── onboarding-storage.ts
│   │   └── recommendation-engine.ts
│   │
│   ├── decks/
│   │   ├── deck-service.ts
│   │   ├── deck-query.ts
│   │   └── deck-utils.ts
│   │
│   ├── cards/
│   │   ├── card-engine.ts
│   │   ├── card-ordering.ts
│   │   ├── card-randomizer.ts
│   │   └── card-utils.ts
│   │
│   ├── session/
│   │   ├── session-store.ts
│   │   ├── session-storage.ts
│   │   ├── session-service.ts
│   │   └── session-utils.ts
│   │
│   └── favorites/
│       ├── favorite-store.ts
│       ├── favorite-storage.ts
│       └── favorite-utils.ts
│
├── data/
│   ├── decks.ts
│   ├── cards.ts
│   └── onboarding-options.ts
│
├── hooks/
│   ├── use-card-session.ts
│   ├── use-favorites.ts
│   ├── use-local-storage.ts
│   ├── use-deck-recommendations.ts
│   └── use-pwa-install.ts
│
├── lib/
│   ├── constants.ts
│   ├── routes.ts
│   ├── cn.ts
│   ├── storage-keys.ts
│   ├── format.ts
│   ├── id.ts
│   └── motion.ts
│
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   └── utilities.css
│
└── types/
    ├── deck.ts
    ├── card.ts
    ├── session.ts
    ├── onboarding.ts
    ├── user.ts
    └── common.ts
```

---

## 10. Data Models

### 10.1 Deck

```ts
export type DeckCategory =
  | "ice-breaker"
  | "pdkt"
  | "pacaran"
  | "ldr"
  | "pra-nikah"
  | "apresiasi"
  | "konflik"
  | "masa-depan"
  | "sahabat"
  | "keluarga"
  | "suami-istri";

export type DeckColorVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "dark"
  | "light";

export type Deck = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: DeckCategory;
  cardCount: number;
  estimatedMinutes: number;
  isPremium: boolean;
  isRecommended?: boolean;
  colorVariant: DeckColorVariant;
  coverIllustration?: string;
  sortOrder: number;
};
```

---

### 10.2 Conversation Card

```ts
export type CardType = "question" | "wildcard";

export type CardTopic =
  | "intro"
  | "values"
  | "family"
  | "finance"
  | "conflict"
  | "future"
  | "appreciation"
  | "distance"
  | "commitment"
  | "intimacy"
  | "daily-life"
  | "trust";

export type CardSensitivity = "low" | "medium" | "high";

export type CardPhase =
  | "opening"
  | "warm"
  | "core"
  | "reflection";

export type ConversationCard = {
  id: string;
  deckId: string;
  type: CardType;
  topic: CardTopic;
  sensitivity: CardSensitivity;
  phase: CardPhase;
  content: string;
  isPremium: boolean;
  sortOrder: number;
  isActive: boolean;
};
```

---

### 10.3 Card Session

```ts
export type SessionStatus =
  | "active"
  | "completed"
  | "abandoned";

export type CardAction =
  | "viewed"
  | "skipped"
  | "favorited"
  | "unfavorited";

export type SessionCardLog = {
  cardId: string;
  action: CardAction;
  shownAt: string;
};

export type CardSession = {
  id: string;
  deckId: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  currentCardId?: string;
  viewedCardIds: string[];
  skippedCardIds: string[];
  favoriteCardIds: string[];
  logs: SessionCardLog[];
};
```

---

### 10.4 Play Together Multiplayer

```ts
export enum RoomStatus {
  Waiting = "waiting",
  Active = "active",
  Ended = "ended",
  Abandoned = "abandoned",
}

export type MultiplayerRoom = {
  id: string;
  code: string;
  deckId: string;
  hostPlayerId: string;
  status: RoomStatus;
  currentTurnPlayerId?: string;
  turnIndex: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
};

export type RoomPlayer = {
  id: string;
  roomId: string;
  userId?: string;
  displayName: string;
  seatIndex: number;
  isHost: boolean;
  joinedAt: string;
  leftAt?: string;
};

export type RoomCard = {
  id: string;
  roomId: string;
  cardId: string;
  position: number;
  isRevealed: boolean;
  revealedAt?: string;
  revealedByPlayerId?: string;
};
```

---

### 10.5 Onboarding Preference

```ts
export type RelationshipType =
  | "partner"
  | "pdkt"
  | "friend"
  | "family"
  | "self";

export type RelationshipStage =
  | "new"
  | "dating"
  | "ldr"
  | "engaged"
  | "married";

export type PreferredTone =
  | "casual"
  | "honest"
  | "fun"
  | "serious";

export type OnboardingPreference = {
  relationshipType?: RelationshipType;
  relationshipStage?: RelationshipStage;
  preferredTone?: PreferredTone;
  completedOnboarding: boolean;
};
```

---

### 10.6 Anonymous User

```ts
export type AnonymousUser = {
  id: string;
  createdAt: string;
};
```

---

## 11. Local Storage Schema

### 11.1 Storage Keys

```ts
export const STORAGE_KEYS = {
  ANONYMOUS_USER: "dcc_anonymous_user",
  ONBOARDING: "dcc_onboarding",
  ACTIVE_SESSION: "dcc_active_session",
  SESSION_HISTORY: "dcc_session_history",
  FAVORITES: "dcc_favorites",
  VIEWED_CARDS: "dcc_viewed_cards",
  SETTINGS: "dcc_settings",
} as const;
```

### 11.2 Anonymous User Example

```json
{
  "id": "anon_1736600000000_x9k2a",
  "createdAt": "2026-01-11T10:00:00.000Z"
}
```

### 11.3 Onboarding Example

```json
{
  "relationshipType": "partner",
  "relationshipStage": "engaged",
  "preferredTone": "serious",
  "completedOnboarding": true
}
```

### 11.4 Active Session Example

```json
{
  "id": "session_1736600000000_abc12",
  "deckId": "deck_pra_nikah",
  "status": "active",
  "startedAt": "2026-01-11T10:00:00.000Z",
  "currentCardId": "pra_nikah_001",
  "viewedCardIds": ["pra_nikah_001"],
  "skippedCardIds": [],
  "favoriteCardIds": [],
  "logs": [
    {
      "cardId": "pra_nikah_001",
      "action": "viewed",
      "shownAt": "2026-01-11T10:01:00.000Z"
    }
  ]
}
```

### 11.5 Favorites Example

```json
{
  "cardIds": ["pdkt_001", "pra_nikah_004"],
  "updatedAt": "2026-01-11T10:05:00.000Z"
}
```

---

## 12. State Management

### 12.1 Store List

| Store | Responsibility |
|---|---|
| `onboardingStore` | User context and preferences |
| `sessionStore` | Active session, current card, session logs |
| `favoriteStore` | Favorite card IDs |
| `settingsStore` | User preferences and reset actions |

---

### 12.2 Session Store Shape

```ts
type SessionStore = {
  currentSession: CardSession | null;

  createSession: (deckId: string) => CardSession;
  restoreSession: () => void;
  setCurrentCard: (cardId: string) => void;

  markViewed: (cardId: string) => void;
  skipCard: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;

  endSession: () => void;
  abandonSession: () => void;
  resetSession: () => void;
};
```

---

### 12.3 Favorite Store Shape

```ts
type FavoriteStore = {
  favoriteCardIds: string[];

  loadFavorites: () => void;
  isFavorite: (cardId: string) => boolean;
  addFavorite: (cardId: string) => void;
  removeFavorite: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;
  clearFavorites: () => void;
};
```

---

### 12.4 Onboarding Store Shape

```ts
type OnboardingStore = {
  preference: OnboardingPreference;

  setRelationshipType: (value: RelationshipType) => void;
  setRelationshipStage: (value: RelationshipStage) => void;
  setPreferredTone: (value: PreferredTone) => void;

  completeOnboarding: () => void;
  resetOnboarding: () => void;
};
```

---

## 13. Static Data

### 13.1 Deck Data Example

```ts
import type { Deck } from "@/types/deck";

export const decks: Deck[] = [
  {
    id: "deck_ice_breaker",
    slug: "ice-breaker",
    title: "Ice Breaker",
    description: "Pertanyaan ringan buat mulai obrolan tanpa canggung.",
    category: "ice-breaker",
    cardCount: 30,
    estimatedMinutes: 15,
    isPremium: false,
    isRecommended: true,
    colorVariant: "tertiary",
    sortOrder: 1,
  },
  {
    id: "deck_pdkt",
    slug: "pdkt",
    title: "PDKT",
    description: "Pertanyaan buat yang lagi saling nebak rasa.",
    category: "pdkt",
    cardCount: 30,
    estimatedMinutes: 20,
    isPremium: false,
    isRecommended: true,
    colorVariant: "secondary",
    sortOrder: 2,
  },
  {
    id: "deck_pra_nikah",
    slug: "pra-nikah",
    title: "Pra-Nikah",
    description: "Bahas ekspektasi, keluarga, finansial, konflik, dan masa depan sebelum melangkah lebih jauh.",
    category: "pra-nikah",
    cardCount: 30,
    estimatedMinutes: 35,
    isPremium: false,
    isRecommended: false,
    colorVariant: "primary",
    sortOrder: 5,
  }
];
```

---

### 13.2 Card Data Example

```ts
import type { ConversationCard } from "@/types/card";

export const cards: ConversationCard[] = [
  {
    id: "ice_001",
    deckId: "deck_ice_breaker",
    type: "question",
    topic: "intro",
    sensitivity: "low",
    phase: "opening",
    content: "Kalau hari ini bisa diulang dari awal, bagian mana yang ingin kamu nikmati lebih lama?",
    isPremium: false,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "pdkt_001",
    deckId: "deck_pdkt",
    type: "question",
    topic: "intro",
    sensitivity: "low",
    phase: "opening",
    content: "Hal kecil apa yang biasanya bikin kamu tertarik sama seseorang?",
    isPremium: false,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "pra_nikah_001",
    deckId: "deck_pra_nikah",
    type: "question",
    topic: "finance",
    sensitivity: "medium",
    phase: "core",
    content: "Kalau nanti kita menikah, hal finansial apa yang paling perlu kita sepakati dari awal?",
    isPremium: false,
    sortOrder: 1,
    isActive: true,
  }
];
```

---

## 14. Card Selection Engine

### 14.1 Purpose

Card engine bertugas memilih kartu berikutnya dari deck yang sedang dimainkan.

Karena tidak ada level selection, engine harus menjaga flow percakapan melalui metadata internal.

---

### 14.2 Input

```ts
type GetNextCardParams = {
  deckId: string;
  allCards: ConversationCard[];
  viewedCardIds: string[];
  skippedCardIds: string[];
};
```

---

### 14.3 Output

```ts
ConversationCard | null
```

Jika `null`, berarti kartu di deck tersebut sudah habis.

---

### 14.4 Selection Logic

```txt
1. Ambil semua kartu dengan deckId yang sama.
2. Filter kartu yang tidak aktif.
3. Filter kartu yang sudah viewed.
4. Filter kartu yang sudah skipped.
5. Urutkan berdasarkan phase:
   opening → warm → core → reflection
6. Jika phase sama, urutkan berdasarkan sortOrder.
7. Return kartu pertama.
8. Jika tidak ada kartu tersisa, return null.
```

---

### 14.5 Implementation Example

```ts
import type { ConversationCard, CardPhase } from "@/types/card";

const PHASE_ORDER: CardPhase[] = [
  "opening",
  "warm",
  "core",
  "reflection",
];

type GetNextCardParams = {
  deckId: string;
  allCards: ConversationCard[];
  viewedCardIds: string[];
  skippedCardIds: string[];
};

export function getNextCard({
  deckId,
  allCards,
  viewedCardIds,
  skippedCardIds,
}: GetNextCardParams): ConversationCard | null {
  const unavailableCardIds = new Set([
    ...viewedCardIds,
    ...skippedCardIds,
  ]);

  const availableCards = allCards.filter((card) => {
    return (
      card.deckId === deckId &&
      card.isActive &&
      !unavailableCardIds.has(card.id)
    );
  });

  if (availableCards.length === 0) {
    return null;
  }

  const sortedCards = [...availableCards].sort((a, b) => {
    const phaseA = PHASE_ORDER.indexOf(a.phase);
    const phaseB = PHASE_ORDER.indexOf(b.phase);

    if (phaseA !== phaseB) {
      return phaseA - phaseB;
    }

    return a.sortOrder - b.sortOrder;
  });

  return sortedCards[0];
}
```

---

### 14.6 Optional Randomization

Untuk membuat pengalaman tidak terlalu linear, randomization bisa ditambahkan dalam phase yang sama.

```txt
phase tetap berurutan
tetapi kartu dalam phase yang sama bisa diacak
```

Example:

```ts
export function shuffleCards(cards: ConversationCard[]): ConversationCard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}
```

Catatan: untuk MVP, urutan deterministic lebih mudah diuji.

---

## 15. Session Flow

### 15.1 Start Session Flow

```txt
User membuka /decks/[slug]
↓
User klik "Mulai Deck Ini"
↓
System mencari deck berdasarkan slug
↓
System membuat session ID
↓
System mengambil kartu pertama dari card engine
↓
System menyimpan session ke store
↓
System persist session ke localStorage
↓
Redirect ke /play/[sessionId]
```

---

### 15.2 Next Card Flow

```txt
User klik Next
↓
System mark current card as viewed
↓
System memanggil getNextCard
↓
Jika kartu tersedia:
    set currentCardId
    render card baru
Jika tidak tersedia:
    redirect ke /summary/[sessionId]
```

---

### 15.3 Skip Card Flow

```txt
User klik Skip
↓
System mark current card as skipped
↓
System memanggil getNextCard
↓
Jika kartu tersedia:
    set currentCardId
    render card baru
Jika tidak tersedia:
    redirect ke /summary/[sessionId]
```

---

### 15.4 Favorite Flow

```txt
User klik Favorite
↓
Jika card belum favorite:
    add to favoriteCardIds
    add to global favorites
Jika card sudah favorite:
    remove from favoriteCardIds
    remove from global favorites
↓
Update localStorage
↓
Update active icon state
```

---

### 15.5 End Session Flow

```txt
User klik End Session
↓
Show confirmation dialog
↓
Jika confirm:
    status = completed
    endedAt = current timestamp
    save to session history
    remove active session or mark inactive
    redirect ke /summary/[sessionId]
```

---

### 15.6 Abandon Session Flow

```txt
User keluar dari play screen
↓
Session tetap active
↓
Home menampilkan Continue Session
```

---

### 15.7 Play Together Mode Flow

Play Together Mode menggunakan room multiplayer turn-based. Phase awal boleh memakai polling, lalu dapat dinaikkan ke WebSocket/Socket.IO tanpa mengubah kontrak event utama.

#### Create Room Flow

```txt
Host membuka deck detail
-> Host klik Play Together
-> System membuat MultiplayerRoom
-> System membuat RoomPlayer untuk host
-> System membuat RoomCard berdasarkan card deck order
-> Redirect ke /rooms/[code]
```

#### Join Room Flow

```txt
Player membuka room link atau memasukkan code
-> System validasi room code
-> Jika room waiting/active:
   buat RoomPlayer
   tampilkan room state terbaru
-> Jika room ended:
   tampilkan room ended state
```

#### Turn Management Rules

- Room memiliki `currentTurnPlayerId` dan `turnIndex`.
- Saat room dimulai, current turn diarahkan ke player aktif dengan `seatIndex` terkecil.
- Hanya `currentTurnPlayerId` yang boleh melakukan reveal.
- Setelah card revealed, turn tidak otomatis berpindah sampai action `next-turn` dijalankan.
- `next-turn` memilih player aktif berikutnya berdasarkan urutan `seatIndex`.
- Player yang sudah `leftAt` tidak mendapat turn.
- Jika current-turn player keluar, host atau system dapat memindahkan turn ke player aktif berikutnya.
- Jika room status bukan `active`, reveal dan next-turn ditolak.
- Host dapat mengakhiri room; setelah ended, semua action mutasi ditolak kecuali read.

#### API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/rooms` | Create multiplayer room |
| `POST` | `/api/rooms/[code]/join` | Join room by code |
| `GET` | `/api/rooms/[code]` | Fetch room state |
| `POST` | `/api/rooms/[code]/cards/[roomCardId]/reveal` | Reveal card if current-turn player |
| `POST` | `/api/rooms/[code]/next-turn` | Advance turn to next player |
| `POST` | `/api/rooms/[code]/leave` | Mark player as left |
| `POST` | `/api/rooms/[code]/end` | Host ends room |

Request/response shape should return the full room state after mutating actions:

```ts
type MultiplayerRoomState = {
  room: MultiplayerRoom;
  players: RoomPlayer[];
  cards: Array<RoomCard & { card: ConversationCard }>;
};
```

#### Real-time Event Contract

```ts
type RoomEvent =
  | { type: "room:player_joined"; roomCode: string; player: RoomPlayer }
  | { type: "room:card_revealed"; roomCode: string; roomCard: RoomCard }
  | { type: "room:turn_changed"; roomCode: string; currentTurnPlayerId: string; turnIndex: number }
  | { type: "room:player_left"; roomCode: string; playerId: string }
  | { type: "room:ended"; roomCode: string; endedAt: string };
```

Realtime behavior:

- `room:player_joined` fires after successful join.
- `room:card_revealed` fires after reveal succeeds.
- `room:turn_changed` fires after next-turn succeeds.
- `room:player_left` fires after leave succeeds or disconnect timeout is confirmed.
- `room:ended` fires when host ends the session.
- Polling fallback should call `GET /api/rooms/[code]` on an interval and reconcile by server state.

---

## 16. Onboarding Logic

### 16.1 Steps

```txt
Step 1: Kamu mau main kartu ini dengan siapa?
Step 2: Situasi kalian sekarang?
Step 3: Mau mulai dari obrolan seperti apa?
```

Step 3 bersifat optional.

---

### 16.2 Conditional Logic

Jika user memilih:

```txt
partner / pdkt
```

Maka tampilkan relationship stage.

Jika user memilih:

```txt
friend / family / self
```

Relationship stage bisa dilewati.

---

### 16.3 Onboarding Completion

```txt
User memilih minimal relationshipType
↓
Data disimpan ke onboardingStore
↓
completedOnboarding = true
↓
Persist ke localStorage
↓
Redirect ke /home
```

---

## 17. Recommendation Logic

### 17.1 Purpose

Memberikan rekomendasi deck di Home berdasarkan onboarding preference.

---

### 17.2 Mapping

| Condition | Recommended Decks |
|---|---|
| relationshipType = pdkt | PDKT, Ice Breaker, Apresiasi |
| relationshipStage = new | PDKT, Ice Breaker |
| relationshipStage = dating | Pacaran, Apresiasi, Konflik & Ekspektasi |
| relationshipStage = ldr | LDR, Apresiasi, Masa Depan |
| relationshipStage = engaged | Pra-Nikah, Masa Depan, Konflik & Ekspektasi |
| relationshipStage = married | Suami-Istri, Apresiasi, Keuangan & Masa Depan |
| relationshipType = friend | Ice Breaker, Sahabat, Apresiasi |
| relationshipType = family | Keluarga, Apresiasi, Masa Depan |
| relationshipType = self | Refleksi Diri, Ice Breaker |

---

### 17.3 Implementation Example

```ts
import type { Deck } from "@/types/deck";
import type { OnboardingPreference } from "@/types/onboarding";

export function getRecommendedDeckSlugs(
  preference: OnboardingPreference
): string[] {
  if (preference.relationshipStage === "engaged") {
    return ["pra-nikah", "masa-depan", "konflik"];
  }

  if (preference.relationshipStage === "ldr") {
    return ["ldr", "apresiasi", "masa-depan"];
  }

  if (preference.relationshipStage === "dating") {
    return ["pacaran", "apresiasi", "konflik"];
  }

  if (preference.relationshipType === "pdkt") {
    return ["pdkt", "ice-breaker", "apresiasi"];
  }

  if (preference.relationshipType === "friend") {
    return ["ice-breaker", "sahabat", "apresiasi"];
  }

  if (preference.relationshipType === "family") {
    return ["keluarga", "apresiasi", "masa-depan"];
  }

  return ["ice-breaker", "pdkt", "apresiasi"];
}

export function getRecommendedDecks(
  decks: Deck[],
  preference: OnboardingPreference
): Deck[] {
  const recommendedSlugs = getRecommendedDeckSlugs(preference);

  return recommendedSlugs
    .map((slug) => decks.find((deck) => deck.slug === slug))
    .filter(Boolean) as Deck[];
}
```

---

## 18. Component Mapping

### 18.1 UI Components

| Component | Purpose |
|---|---|
| `Button` | Primary/secondary action |
| `Badge` | Metadata label |
| `Chip` | Filter/category |
| `IconButton` | Small icon action |
| `BottomSheet` | Pause/share/paywall sheet |
| `Modal` | Confirmation dialog |
| `Progress` | Onboarding/session progress |
| `Toast` | Lightweight feedback |

---

### 18.2 Layout Components

| Component | Purpose |
|---|---|
| `AppShell` | Main app wrapper |
| `MobileContainer` | Max-width mobile layout |
| `BottomNav` | Navigation for main app pages |
| `PageHeader` | Page title and action |
| `PlayShell` | Distraction-free play mode layout |

---

### 18.3 Deck Components

| Component | Purpose |
|---|---|
| `DeckCard` | Card for deck list |
| `DeckGrid` | Grid/list of decks |
| `DeckDetailHero` | Main header for deck detail |
| `DeckMeta` | Card count, duration, premium |
| `DeckPreviewCard` | Preview sample question |

---

### 18.4 Card Components

| Component | Purpose |
|---|---|
| `QuestionCard` | Main question card |
| `WildcardCard` | Instruction/non-question card |
| `CardActions` | Favorite, skip, next |
| `FavoriteButton` | Toggle favorite |
| `SkipButton` | Skip current card |
| `ShareCardPreview` | Social sharing template |

---

### 18.5 Session Components

| Component | Purpose |
|---|---|
| `SessionSummaryCard` | Summary after play |
| `PauseSessionSheet` | Pause options |
| `EndSessionDialog` | Confirm end session |
| `EmptyDeckState` | No card left |

---

## 19. Page-Level Technical Requirements

### 19.1 Landing Page

Route:

```txt
/
```

Requirements:

- Render static content.
- CTA to `/onboarding`.
- Secondary CTA to `/decks`.
- Mobile-first.
- No user data required.

---

### 19.2 Onboarding Page

Route:

```txt
/onboarding
```

Requirements:

- Render step-based UI.
- Store answer per step.
- Allow skip.
- Save final preference to localStorage.
- Redirect to `/home`.

---

### 19.3 Home Page

Route:

```txt
/home
```

Requirements:

- Load onboarding preference.
- Load active session.
- Load recommended decks.
- Show continue session if active session exists.
- Show bottom navigation.

---

### 19.4 Deck Library Page

Route:

```txt
/decks
```

Requirements:

- Load all decks.
- Support filter chips.
- Support premium/free badge.
- Navigate to deck detail by slug.
- Show bottom navigation.

---

### 19.5 Deck Detail Page

Route:

```txt
/decks/[slug]
```

Requirements:

- Find deck by slug.
- Load preview cards for deck.
- Start session on CTA click.
- Redirect to `/play/[sessionId]`.

Error states:

- Deck not found
- Deck locked, if premium is active later

---

### 19.6 Play Page

Route:

```txt
/play/[sessionId]
```

Requirements:

- Restore active session.
- Validate session ID.
- Load current card.
- If no current card, get next card.
- Handle next, skip, favorite, end.
- Persist session after each action.
- Hide bottom navigation.

Error states:

- Session not found
- Deck not found
- Card not found
- End of deck

---

### 19.7 Summary Page

Route:

```txt
/summary/[sessionId]
```

Requirements:

- Load completed session.
- Show cards viewed count.
- Show favorites count.
- Show deck title.
- CTA to home, favorites, play again.

---

### 19.8 Favorites Page

Route:

```txt
/favorites
```

Requirements:

- Load favorite card IDs.
- Map IDs to card data.
- Filter by deck.
- Remove favorite.
- Empty state if none.

---

### 19.9 Settings Page

Route:

```txt
/settings
```

Requirements:

- Show guest status.
- Reset onboarding.
- Reset favorites.
- Reset all local data.
- Show app info.

---

## 20. Analytics Events

### 20.1 Event List

| Event | Trigger |
|---|---|
| `landing_viewed` | User opens landing page |
| `onboarding_started` | User enters onboarding |
| `onboarding_step_completed` | User completes step |
| `onboarding_completed` | User finishes onboarding |
| `deck_library_viewed` | User opens `/decks` |
| `deck_viewed` | User opens deck detail |
| `session_started` | User starts deck |
| `card_viewed` | Card appears |
| `card_skipped` | User skips card |
| `card_favorited` | User favorites card |
| `card_unfavorited` | User removes favorite |
| `session_completed` | User ends session |
| `favorites_viewed` | User opens favorites |
| `share_clicked` | User clicks share |
| `premium_clicked` | User opens premium page |

---

### 20.2 Event Payload Examples

```ts
type AnalyticsEvent = {
  name: string;
  timestamp: string;
  anonymousUserId?: string;
  payload?: Record<string, unknown>;
};
```

Example:

```json
{
  "name": "card_favorited",
  "timestamp": "2026-01-11T10:05:00.000Z",
  "anonymousUserId": "anon_1736600000000_x9k2a",
  "payload": {
    "deckId": "deck_pra_nikah",
    "cardId": "pra_nikah_001"
  }
}
```

For MVP, analytics can be logged to console or prepared as a wrapper function.

---

## 21. Error & Empty States

### 21.1 Deck Not Found

Message:

```txt
Deck ini belum tersedia.
```

CTA:

```txt
Lihat Deck Lain
```

---

### 21.2 Session Not Found

Message:

```txt
Sesi ini tidak ditemukan atau sudah berakhir.
```

CTA:

```txt
Mulai Sesi Baru
```

---

### 21.3 No Cards Left

Message:

```txt
Kamu sudah membuka semua kartu di deck ini.
```

CTA:

```txt
Lihat Ringkasan
```

---

### 21.4 No Favorites

Message:

```txt
Belum ada kartu yang disimpan.
Simpan pertanyaan yang ingin kamu bahas lagi nanti.
```

CTA:

```txt
Cari Deck
```

---

### 21.5 Local Storage Unavailable

Message:

```txt
Browser kamu membatasi penyimpanan lokal. Beberapa progres mungkin tidak tersimpan.
```

Fallback:

```txt
Continue in memory state
```

---

## 22. PWA Requirements

### 22.1 MVP PWA Requirements

- Web app manifest.
- App name.
- App icon.
- Theme color.
- Mobile-friendly viewport.
- Installable on supported browsers.

### 22.2 Future PWA Requirements

- Offline access for selected deck.
- Cached static assets.
- Cached deck/card data.
- Install prompt.
- Basic service worker.

### 22.3 Manifest Example

```json
{
  "name": "Digital Conversation Card",
  "short_name": "CardTalk",
  "description": "Kartu obrolan digital untuk percakapan yang lebih seru dan bermakna.",
  "start_url": "/home",
  "display": "standalone",
  "background_color": "#fcf9f8",
  "theme_color": "#ff7551",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 23. Accessibility Requirements

- Minimum text size: 16px.
- Main question text should be large and readable.
- Touch target minimum: 44px x 44px.
- Icon buttons must have aria-label.
- Color cannot be the only indicator of state.
- Focus state must be visible.
- Motion should be subtle.
- Provide reduced-motion support if possible.
- All interactive controls must be keyboard accessible.

---

## 24. Performance Requirements

- Initial load should be fast on mobile.
- Card transition should feel instant.
- Avoid large images in MVP.
- Static data should be bundled efficiently.
- Card data should be filtered in memory.
- Persist to localStorage should not block UI.
- Animation should not cause layout shift.

---

## 25. Security & Privacy Notes

MVP does not collect private answers.

Do not store:

- User answers
- Chat content
- Personal notes
- Sensitive relationship confession

Allowed to store:

- Card IDs
- Deck IDs
- Session progress
- Favorite IDs
- Onboarding preference

If later adding:

- Login
- Couple mode
- User notes
- Chat
- Cloud sync

Then privacy and data security must be redesigned.

---

## 26. Testing Requirements

### 26.1 Unit Tests

Recommended targets:

- `getNextCard`
- `getRecommendedDecks`
- `sessionStore`
- `favoriteStore`
- localStorage helpers

### 26.2 Flow Tests

Test flows:

```txt
First time user flow
Returning user flow
Start session flow
Next card flow
Skip card flow
Favorite card flow
End session flow
No cards left flow
```

### 26.3 UI Tests

Check:

- Play screen shows one card.
- Bottom nav hidden in play mode.
- Favorite active state works.
- Skip does not break session.
- Summary count is correct.
- Empty favorites state works.

---

## 27. Development Milestones

### Milestone 1 — Foundation

Scope:

- Next.js setup
- Tailwind setup
- Design tokens
- App routing
- Static deck/card data
- Basic layout components

Output:

```txt
App shell is ready
Deck data can be rendered
```

---

### Milestone 2 — Core Deck Flow

Scope:

- Landing page
- Home page
- Deck library
- Deck detail
- Start session

Output:

```txt
User can browse decks and start a session
```

---

### Milestone 3 — Card Play Engine

Scope:

- Play screen
- Card engine
- Next card
- Skip card
- No-repeat logic
- End session

Output:

```txt
User can complete a card session
```

---

### Milestone 4 — Favorites & Summary

Scope:

- Favorite card
- Favorites page
- Session summary
- Local persistence

Output:

```txt
User can save cards and view session result
```

---

### Milestone 5 — Onboarding & Recommendations

Scope:

- Onboarding page
- Onboarding store
- Recommendation engine
- Recommended deck section

Output:

```txt
User gets deck recommendations based on context
```

---

### Milestone 6 — PWA & Polish

Scope:

- Manifest
- Icons
- Install prompt
- Empty states
- Animation polish
- Accessibility QA

Output:

```txt
MVP is ready for public test
```

---

## 28. Future Backend Mapping

When moving to backend, static files can be migrated as follows:

| MVP Local | Future Backend |
|---|---|
| `data/decks.ts` | `decks` table |
| `data/cards.ts` | `cards` table |
| localStorage sessions | `sessions` table |
| localStorage favorites | `favorites` table |
| local onboarding | `user_preferences` table |
| static premium flag | entitlement table/payment provider |

---

## 29. Future Database Tables

### 29.1 decks

```txt
id
slug
title
description
category
card_count
estimated_minutes
is_premium
color_variant
sort_order
created_at
updated_at
```

### 29.2 cards

```txt
id
deck_id
type
topic
sensitivity
phase
content
is_premium
sort_order
is_active
created_at
updated_at
```

### 29.3 sessions

```txt
id
user_id nullable
anonymous_id nullable
deck_id
status
started_at
ended_at
```

### 29.4 session_cards

```txt
id
session_id
card_id
action
shown_at
```

### 29.5 favorites

```txt
id
user_id nullable
anonymous_id nullable
card_id
created_at
```

---

## 30. Open Technical Questions

- Apakah MVP akan memakai static file sepenuhnya atau langsung pakai Supabase?
- Apakah analytics langsung diintegrasikan dari awal?
- Apakah card randomization perlu ada di MVP?
- Apakah skipped card boleh muncul lagi setelah session selesai?
- Apakah user bisa resume session setelah menutup tab?
- Apakah share card masuk MVP atau P1?
- Apakah PWA install prompt dibuat manual atau menggunakan browser event?
- Apakah deck premium ditampilkan sejak MVP walau belum bisa dibeli?
- Apakah cards perlu mendukung multi-language sejak awal?
- Apakah desain desktop hanya wrapper mobile atau layout khusus?

---

## 31. Technical Acceptance Criteria

MVP teknis dianggap siap jika:

```txt
User bisa membuka landing page.
User bisa menyelesaikan onboarding tanpa login.
User bisa melihat home dan deck recommendation.
User bisa membuka deck library.
User bisa membuka deck detail.
User bisa memulai session.
User bisa melihat satu card di play screen.
User bisa klik next.
User bisa klik skip.
User bisa klik favorite.
Card tidak berulang dalam session yang sama.
User bisa mengakhiri session.
User bisa melihat summary.
User bisa melihat favorite cards.
Data tetap ada setelah refresh browser.
Bottom navigation tidak tampil di play screen.
App mobile-friendly.
```

---

## 32. Final Technical Summary

MVP dibangun sebagai web/PWA frontend-first dengan local storage persistence.

Core technical flow:

```txt
Choose Deck
↓
Create Session
↓
Get First Card
↓
Render Play Screen
↓
Next / Skip / Favorite
↓
Update State
↓
Persist to localStorage
↓
End Session
↓
Show Summary
```

Core implementation modules:

```txt
Deck data
Card data
Session store
Favorite store
Onboarding store
Recommendation engine
Card selection engine
Local storage helper
Play screen components
```

Main technical constraint:

```txt
No level selection.
All emotional flow is handled by deck, phase, sensitivity, topic, and sortOrder.
```
