# Backend Implementation Plan — Digital Conversation Card App (Convo)

Building the backend layer to evolve the app from a local-first static data frontend to a full-stack application with database persistence, content management, and future monetization support.

---

## Current State Summary

The frontend is **fully implemented** using Next.js 15 + Tailwind CSS 4 + Zustand + localStorage. Key findings:

| Area | Status | Notes |
|---|---|---|
| Framework | ✅ Next.js 15 (App Router) | Ready for API Routes |
| Types | ✅ Aligned to TSM spec | `Deck`, `ConversationCard`, `CardSession`, `OnboardingPreference`, `AnonymousUser` |
| Data | ✅ Static files | 9 decks in `src/data/decks.ts`, ~70 cards in `src/data/cards.ts` |
| Storage | ✅ Separated `dcc_*` keys | With legacy migration from `convo_guest_data` |
| Stores | ✅ Zustand | `sessionStore`, `favoriteStore`, `onboardingStore` |
| Card Engine | ✅ Implemented | Phase-based ordering with `sortOrder` tiebreaker |
| Recommendation | ✅ Implemented | Mapping `relationshipType`/`Stage` → deck slugs |
| Routes | ✅ All P0 routes | Landing, Onboarding, Home, Decks, Deck Detail, Play, Summary, Favorites, Settings |

---

## Folder Structure Review

### Current Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── components/   # ⚠️ Mixed: UI primitives + Figma exports inside app/
│   ├── pages/        # ⚠️ Page components inside app/ (non-standard)
│   ├── layouts/      # ❌ Empty directory
│   ├── home/page.tsx
│   ├── decks/[slug]/page.tsx
│   ├── play/[sessionId]/page.tsx
│   └── ...
├── data/             # Static deck/card data
├── imports/          # ⚠️ Contains only HTML→Body/ subfolder (likely Figma artifact)
├── stores/           # Zustand stores
├── styles/           # CSS files (theme, fonts, globals)
├── types/            # TypeScript type definitions
└── utils/            # Card engine, recommendation, storage
```

### Recommended Changes

> [!IMPORTANT]
> The following folder structure issues should be addressed during backend implementation:

| Issue | Current | Recommended | Reason |
|---|---|---|---|
| `src/app/pages/` | Page components in `app/pages/` | Move to `src/components/pages/` or inline in route files | Next.js convention: `app/` should only contain route segments |
| `src/app/components/` | Components inside `app/` | Move to `src/components/` (top-level) | Keeps `app/` clean for routing only |
| `src/app/layouts/` | Empty | Delete | Unused |
| `src/imports/` | Contains `Html→Body/` | Delete or move to `src/app/components/figma/` | Appears to be a Figma export artifact |
| Missing `src/lib/` | Utils scattered | Create `src/lib/` for shared utilities | TSM §9 recommends `lib/` for constants, routes, etc. |
| Missing `src/app/api/` | No API routes | Create `src/app/api/` | Backend API routes go here |
| Missing `prisma/` | No database | Create `prisma/` at project root | Prisma schema and migrations |

### Proposed Backend Folder Structure

```
project-root/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script (migrate static data)
│   └── migrations/            # Auto-generated
│
├── src/
│   ├── app/
│   │   ├── api/               # [NEW] API Routes
│   │   │   ├── decks/
│   │   │   │   ├── route.ts                    # GET /api/decks
│   │   │   │   └── [slug]/
│   │   │   │       ├── route.ts                # GET /api/decks/:slug
│   │   │   │       └── cards/route.ts          # GET /api/decks/:slug/cards
│   │   │   ├── sessions/
│   │   │   │   ├── route.ts                    # POST /api/sessions
│   │   │   │   └── [sessionId]/
│   │   │   │       ├── route.ts                # GET, PATCH /api/sessions/:id
│   │   │   │       └── actions/route.ts        # POST /api/sessions/:id/actions
│   │   │   ├── favorites/
│   │   │   │   └── route.ts                    # GET, POST, DELETE /api/favorites
│   │   │   ├── onboarding/
│   │   │   │   └── route.ts                    # GET, POST /api/onboarding
│   │   │   ├── analytics/
│   │   │   │   └── route.ts                    # POST /api/analytics
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts      # NextAuth.js (future)
│   │   │   └── admin/                          # [P2] Admin endpoints
│   │   │       ├── decks/route.ts
│   │   │       └── cards/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ... (existing route pages)
│   │
│   ├── lib/                   # [NEW] Shared backend utilities
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # Auth helpers
│   │   ├── api-response.ts    # Standardized API responses
│   │   └── validators.ts      # Input validation (Zod)
│   │
│   ├── services/              # [NEW] Business logic layer
│   │   ├── deck.service.ts
│   │   ├── card.service.ts
│   │   ├── session.service.ts
│   │   ├── favorite.service.ts
│   │   ├── onboarding.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── data/                  # Existing static data (becomes seed source)
│   ├── stores/                # Existing Zustand stores
│   ├── types/                 # Existing types
│   └── utils/                 # Existing frontend utils
```

---

## Backend Tech Stack

| Layer | Tool | Rationale |
|---|---|---|
| API | Next.js API Routes (App Router) | Already using Next.js; zero additional infra |
| ORM | Prisma | Type-safe, great DX, auto-migrations |
| Database | PostgreSQL (via Supabase) | Free tier, managed, scalable, Prisma-compatible |
| Validation | Zod | Runtime type validation for API inputs |
| Auth (future) | NextAuth.js v5 | Guest-first, optional Google/email login later |
| Analytics | Custom events table | Simple event logging, exportable |

---

## Database Schema Design

Based on TSM §29 (Future Database Tables) and the existing TypeScript types:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Content ─────────────────────────────────────

model Deck {
  id                String   @id @default(cuid())
  slug              String   @unique
  title             String
  description       String
  shortDescription  String?
  category          String   // DeckCategory enum value
  cardCount         Int      @default(0)
  estimatedMinutes  Int
  isPremium         Boolean  @default(false)
  isRecommended     Boolean  @default(false)
  colorVariant      String   @default("primary")
  color             String?
  icon              String?
  coverIllustration String?
  sortOrder         Int      @default(0)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  cards    Card[]
  sessions Session[]
}

model Card {
  id          String   @id @default(cuid())
  deckId      String
  type        String   @default("question") // "question" | "wildcard"
  topic       String   // CardTopic enum value
  sensitivity String   @default("low")      // "low" | "medium" | "high"
  phase       String   // "opening" | "warm" | "core" | "reflection"
  content     String
  isPremium   Boolean  @default(false)
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  deck           Deck           @relation(fields: [deckId], references: [id])
  sessionActions SessionAction[]
  favorites      Favorite[]

  @@index([deckId])
  @@index([deckId, isActive, phase])
}

// ─── Users ───────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  anonymousId   String?   @unique  // For guest users
  email         String?   @unique  // For registered users (future)
  name          String?
  provider      String?             // "anonymous" | "google" | "email"
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  onboarding    OnboardingPreference?
  sessions      Session[]
  favorites     Favorite[]
  analyticsEvents AnalyticsEvent[]
}

model OnboardingPreference {
  id                  String   @id @default(cuid())
  userId              String   @unique
  relationshipType    String?  // "partner" | "pdkt" | "friend" | "family" | "self"
  relationshipStage   String?  // "new" | "dating" | "ldr" | "engaged" | "married"
  preferredTone       String?  // "casual" | "honest" | "fun" | "serious"
  completedOnboarding Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Sessions ────────────────────────────────────

model Session {
  id            String   @id @default(cuid())
  userId        String
  deckId        String
  status        String   @default("active") // "active" | "completed" | "abandoned"
  currentCardId String?
  startedAt     DateTime @default(now())
  endedAt       DateTime?

  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck    Deck            @relation(fields: [deckId], references: [id])
  actions SessionAction[]

  @@index([userId, status])
  @@index([deckId])
}

model SessionAction {
  id        String   @id @default(cuid())
  sessionId String
  cardId    String
  action    String   // "viewed" | "skipped" | "favorited" | "unfavorited"
  shownAt   DateTime @default(now())

  session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  card    Card    @relation(fields: [cardId], references: [id])

  @@index([sessionId])
}

// ─── Favorites ───────────────────────────────────

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  cardId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id])

  @@unique([userId, cardId])
  @@index([userId])
}

// ─── Analytics ───────────────────────────────────

model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String?
  name      String   // Event name per TSM §20
  payload   Json?    // Flexible event data
  timestamp DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([name, timestamp])
  @@index([userId])
}
```

---

## API Route Design

All APIs return standardized JSON responses:

```ts
// Success: { success: true, data: T }
// Error:   { success: false, error: string, code: number }
```

### Phase 1 APIs (Core — MVP Backend)

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/decks` | List all decks (with optional `?category=` filter) | Public |
| `GET` | `/api/decks/[slug]` | Get single deck by slug | Public |
| `GET` | `/api/decks/[slug]/cards` | Get cards for a deck (filtered `isActive`, sorted by phase+sortOrder) | Public |
| `POST` | `/api/sessions` | Create new session `{ deckId }` | Guest/User |
| `GET` | `/api/sessions/[id]` | Get session details | Owner only |
| `PATCH` | `/api/sessions/[id]` | Update session (end/abandon) `{ status, currentCardId }` | Owner only |
| `POST` | `/api/sessions/[id]/actions` | Log card action `{ cardId, action }` | Owner only |
| `GET` | `/api/favorites` | Get user's favorite card IDs | Guest/User |
| `POST` | `/api/favorites` | Add favorite `{ cardId }` | Guest/User |
| `DELETE` | `/api/favorites?cardId=xxx` | Remove favorite | Guest/User |
| `GET` | `/api/onboarding` | Get onboarding preference | Guest/User |
| `POST` | `/api/onboarding` | Save onboarding preference | Guest/User |

### Phase 2 APIs (Analytics + Growth)

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/analytics` | Log analytics event(s) | Public |
| `GET` | `/api/sessions/active` | Get user's active session | Guest/User |
| `GET` | `/api/sessions/history` | Get user's session history | Guest/User |

### Phase 3 APIs (Admin — P2)

| Method | Route | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/admin/decks` | List decks with stats | Admin |
| `POST` | `/api/admin/decks` | Create deck | Admin |
| `PATCH` | `/api/admin/decks/[id]` | Update deck | Admin |
| `DELETE` | `/api/admin/decks/[id]` | Soft-delete deck | Admin |
| `GET` | `/api/admin/cards` | List cards with filters | Admin |
| `POST` | `/api/admin/cards` | Create card | Admin |
| `PATCH` | `/api/admin/cards/[id]` | Update card | Admin |
| `DELETE` | `/api/admin/cards/[id]` | Soft-delete card | Admin |

---

## Auth Strategy

### MVP: Guest-First with Anonymous ID

The frontend already generates `anonymousId` via `getOrCreateAnonymousUser()`. The backend strategy:

1. **On first API call**: Client sends `x-anonymous-id` header
2. **Backend**: Finds or creates `User` with matching `anonymousId`
3. **No login wall**: All guest operations work with anonymous ID
4. **Session ownership**: Validated by matching `userId`

```ts
// src/lib/auth.ts — simplified guest auth
export async function getOrCreateGuestUser(req: Request) {
  const anonymousId = req.headers.get('x-anonymous-id');
  if (!anonymousId) throw new ApiError(401, 'Missing anonymous ID');

  return prisma.user.upsert({
    where: { anonymousId },
    create: { anonymousId, provider: 'anonymous' },
    update: {},
  });
}
```

### Future: Optional Login (NextAuth.js v5)

When adding login:
- Guest data migrates to registered account by linking `anonymousId` to `email`
- Supports Google OAuth, magic link, or email/password
- `User` table already supports both `anonymousId` and `email`

---

## Data Migration Plan

### Static Data → Database Seed

The existing `src/data/decks.ts` and `src/data/cards.ts` become the seed source:

```ts
// prisma/seed.ts
import { DECKS } from '../src/data/decks';
import { CARDS } from '../src/data/cards';

async function main() {
  for (const deck of DECKS) {
    await prisma.deck.upsert({
      where: { slug: deck.slug },
      create: { /* map deck fields */ },
      update: { /* map deck fields */ },
    });
  }
  for (const card of CARDS) {
    await prisma.card.upsert({
      where: { id: card.id },
      create: { /* map card fields */ },
      update: { /* map card fields */ },
    });
  }
}
```

### Frontend Integration Strategy

**Hybrid approach** — frontend stores continue working during migration:

1. **Phase 1**: API routes created, but frontend still reads from static data + localStorage
2. **Phase 2**: Create a service layer (`src/services/`) that abstracts data source
3. **Phase 3**: Zustand stores switch from localStorage to API calls
4. **Phase 4**: Remove static data files; all reads from database

This prevents breaking changes and allows gradual rollout.

---

## Proposed Changes (by Phase)

### Phase 1: Database Foundation

> Setup Prisma, PostgreSQL, and seed the database from existing static data.

#### [NEW] `prisma/schema.prisma`
- Full schema as described above

#### [NEW] `prisma/seed.ts`
- Migrate `DECKS` and `CARDS` arrays into database
- Use `upsert` for idempotent seeding

#### [NEW] `src/lib/prisma.ts`
- Prisma client singleton (prevent hot-reload connection leak)

#### [NEW] `src/lib/api-response.ts`
- Standardized `successResponse()` and `errorResponse()` helpers

#### [NEW] `src/lib/validators.ts`
- Zod schemas for API input validation

#### [MODIFY] `package.json`
- Add `prisma`, `@prisma/client`, `zod` dependencies
- Add `prisma:generate`, `prisma:migrate`, `prisma:seed` scripts

#### [NEW] `.env.local`
- `DATABASE_URL` for Supabase/PostgreSQL connection

---

### Phase 2: Core API Routes

> Implement all P0 API routes for decks, cards, sessions, favorites, onboarding.

#### [NEW] `src/lib/auth.ts`
- `getOrCreateGuestUser(req)` — anonymous user resolution
- Header-based auth with `x-anonymous-id`

#### [NEW] `src/services/deck.service.ts`
- `getAllDecks(category?)` — with optional filter
- `getDeckBySlug(slug)` — includes card count
- `getCardsForDeck(deckId)` — active cards, sorted by phase + sortOrder

#### [NEW] `src/services/session.service.ts`
- `createSession(userId, deckId)`
- `getSession(sessionId, userId)` — with ownership check
- `updateSession(sessionId, data)`
- `logAction(sessionId, cardId, action)`
- `getActiveSession(userId)`
- `getSessionHistory(userId)`

#### [NEW] `src/services/favorite.service.ts`
- `getFavorites(userId)` — returns card IDs with card data
- `addFavorite(userId, cardId)` — with duplicate check
- `removeFavorite(userId, cardId)`

#### [NEW] `src/services/onboarding.service.ts`
- `getPreference(userId)`
- `savePreference(userId, data)`

#### [NEW] API route files
- `src/app/api/decks/route.ts`
- `src/app/api/decks/[slug]/route.ts`
- `src/app/api/decks/[slug]/cards/route.ts`
- `src/app/api/sessions/route.ts`
- `src/app/api/sessions/[sessionId]/route.ts`
- `src/app/api/sessions/[sessionId]/actions/route.ts`
- `src/app/api/favorites/route.ts`
- `src/app/api/onboarding/route.ts`

---

### Phase 3: Frontend Integration

> Update Zustand stores and utilities to use API routes instead of localStorage/static data.

#### [NEW] `src/lib/api-client.ts`
- Fetch wrapper with `x-anonymous-id` header injection
- Error handling, retry logic

#### [MODIFY] `src/stores/sessionStore.ts`
- Replace `saveActiveSession()` / `getActiveSession()` with API calls
- Keep local state for optimistic updates

#### [MODIFY] `src/stores/favoriteStore.ts`
- Replace `getFavorites()` / `saveFavorites()` with API calls

#### [MODIFY] `src/stores/onboardingStore.ts`
- Replace `getOnboardingPreference()` / `saveOnboardingPreference()` with API calls

#### [MODIFY] Page components
- Fetch deck data from API instead of importing static files
- Use `fetch('/api/decks')` in server components or `useSWR` in client components

---

### Phase 4: Analytics Backend

> Track user events for product metrics per TSM §20.

#### [NEW] `src/services/analytics.service.ts`
- `logEvent(userId, name, payload)` — insert into `AnalyticsEvent` table
- Batch insert support for multiple events

#### [NEW] `src/app/api/analytics/route.ts`
- `POST /api/analytics` — accepts single or batch events
- Non-blocking; errors don't affect user experience

#### [NEW] `src/utils/analytics.ts` (frontend)
- `trackEvent(name, payload?)` — queues events, sends in batches
- Maps to TSM §20 event names: `landing_viewed`, `session_started`, `card_favorited`, etc.

---

### Phase 5: Admin Content Panel (P2)

> Basic CRUD for decks and cards.

#### [NEW] `src/app/admin/` — Admin pages
- `/admin` — Dashboard with deck/card counts
- `/admin/decks` — Deck management (list, create, edit)
- `/admin/cards` — Card management (list, create, edit, filter by deck)

#### [NEW] Admin API routes
- CRUD endpoints under `/api/admin/`
- Protected by admin role check

---

## Open Questions

> [!IMPORTANT]
> These decisions affect the implementation. Please review before we proceed.

1. **Database provider**: Should we use **Supabase** (managed PostgreSQL, free tier) or a different provider (PlanetScale, Neon, Railway)?

2. **Deployment**: Are you deploying on **Vercel**? This affects database connection pooling setup (Prisma + Vercel requires special config).

3. **Data fetching strategy**: Should page components use **Server Components** (fetch on server, no loading state) or **Client Components with SWR/React Query** (loading states, real-time updates)?

4. **Admin auth**: For the admin panel, is a simple **hardcoded password/env variable** sufficient for MVP, or do you want proper role-based auth from the start?

5. **Card content expansion**: The current card data has ~70 cards across 9 decks. Should the backend seed include generating the remaining cards to reach 30 per deck (270 total) during this phase?

6. **Offline support**: When migrating to API-based data, should we keep a **localStorage fallback** for offline play, or is online-only acceptable for now?

7. **Folder restructure**: Should I also move `src/app/pages/` → `src/components/pages/` and `src/app/components/` → `src/components/` as part of this backend work, or leave that for a separate cleanup task?

---

## Answer for Open Question

Thanks for listing these open questions. My decisions for this phase:

1. **Database provider**: Use **self-hosted PostgreSQL on my VPS**. Please set it up with Prisma migrations, seed scripts, and `.env`-based configuration.

2. **Deployment**: I will deploy on a **VPS**, not Vercel. So we do **not** need Vercel-specific Prisma/serverless pooling config. Please configure it for a standard Node.js deployment, preferably using Docker/PM2 with Nginx reverse proxy.

3. **Data fetching strategy**: Use **Server Components** by default for public/game pages. Use Client Components with SWR/React Query only where loading states, optimistic updates, or admin interactions are needed.

4. **Admin auth**: For MVP, a simple admin password stored in an environment variable is acceptable. Please structure it so we can replace it later with proper role-based auth.

5. **Card content expansion**: Yes, include seeding to reach **30 cards per deck**, so we have the target 270 cards total.

6. **Offline support**: Online-only is acceptable for now. We can add localStorage/offline fallback later if needed.

7. **Folder restructure**: Leave the full folder restructure for a separate cleanup task. Only move files if required for the backend implementation.


## Verification Plan

### Automated Tests
- `npx prisma migrate dev` — verify schema applies without errors
- `npx prisma db seed` — verify all 9 decks + cards seed successfully
- `npm run build` — verify no TypeScript errors after API route additions
- API route testing with `curl` or Thunder Client for each endpoint

### Integration Tests
1. **Deck API**: `GET /api/decks` returns 9 decks, `GET /api/decks/ice-breaker` returns correct deck
2. **Card API**: `GET /api/decks/ice-breaker/cards` returns cards sorted by phase → sortOrder
3. **Session flow**: POST create → POST action (viewed) → PATCH end → GET verify completed
4. **Favorites**: POST add → GET verify → DELETE remove → GET verify empty
5. **Guest auth**: Requests with `x-anonymous-id` create/find user correctly

### Frontend Verification
1. All existing pages still work after API migration
2. Deck data loads from database instead of static files
3. Session persistence works across page refresh (via API, not localStorage)
4. Favorites sync correctly between play page and favorites page
