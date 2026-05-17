# Frontend Implementation Plan — Digital Conversation Card App (Convo)

Comparing PRD, SRS, and TSM specifications against the existing frontend codebase to identify gaps and create a comprehensive implementation plan. **No style changes** — we preserve the existing "Vibrant Operator" visual design exactly as-is.

---

## Current State Summary

The existing frontend is a **Vite + React + Tailwind CSS** app (not Next.js as the TSM recommends) using `react-router` with a Figma-exported design system. It has:

| Area | Status |
|---|---|
| Routing (all P0 pages) | ✅ All 10 routes exist |
| Landing Page | ✅ Implemented (Figma-exported hero + featured decks) |
| Onboarding Page | ✅ 3-step flow with back/skip/next |
| Home Page | ✅ Greeting, continue session, recommended decks |
| Deck Library | ✅ Grid view of all decks |
| Deck Detail | ✅ Hero, meta, preview cards, start CTA |
| Play Page | ✅ Card flip, next/skip/favorite/end session |
| Summary Page | ✅ Stats + CTA buttons |
| Favorites Page | ✅ Filter by deck, remove favorite |
| Settings Page | ✅ Guest data info, clear all data |
| Bottom Nav | ✅ Home/Decks/Favorit/Pengaturan |
| Local Storage | ✅ Single `convo_guest_data` key |
| Card Data | ✅ 9 decks, ~70 cards |
| Types | ✅ Core types defined |

---

## Gap Analysis: PRD/SRS/TSM vs. Current Frontend

### 🔴 Critical Gaps (Must Fix for MVP)

| # | Gap | PRD/SRS Ref | Current State | Impact |
|---|---|---|---|---|
| G1 | **Data model misalignment** — current types use simplified `Deck.name`/`Deck.color`/`Deck.icon` instead of TSM's `slug`, `colorVariant`, `coverIllustration`, `isPremium`, `isRecommended`, `sortOrder` | TSM §10.1 | Types missing several required fields | Future backend migration will break |
| G2 | **Card model missing fields** — no `type` (question/wildcard), no `sortOrder`, no `isActive`, no `isPremium`; uses `question` instead of `content` | TSM §10.2 | Card type is simplified | Card engine cannot properly sort |
| G3 | **Session model drift** — uses `currentCardIndex` instead of `currentCardId`; missing `logs: SessionCardLog[]`; `startedAt`/`completedAt` are `number` not ISO string | TSM §10.3, SRS §13.3 | Session logs not tracked | Cannot properly track card actions |
| G4 | **Onboarding model mismatch** — uses `playingWith`/`situation`/`vibe`/`completedAt` instead of `relationshipType`/`relationshipStage`/`preferredTone`/`completedOnboarding` | TSM §10.4, SRS §13.4 | Naming diverges from spec | Data migration issues |
| G5 | **No anonymous user ID** — system should generate `anonymousUserId` on first visit | SRS §11.2, TSM §10.5 | Not implemented | Analytics & future auth migration broken |
| G6 | **Storage keys mismatch** — uses single `convo_guest_data` key instead of the separated `dcc_*` keys defined in TSM | TSM §11.1 | All data in one blob | Harder to manage, no granular reset |
| G7 | **Card count below minimum** — PRD requires 30 cards per deck (150 total); current has ~5-10 per deck (~70 total) | PRD §16.2 | Insufficient content | Poor play experience, sessions end too quickly |
| G8 | **No deck filter chips on Decks page** | SRS §11.5, PRD §13.4 | Not implemented | Users can't filter by category |
| G9 | **Settings missing "Reset Onboarding" separately** — only has "clear all data" | SRS §11.12, PRD §13.9 | Missing feature | Users can't re-do onboarding without losing favorites |
| G10 | **Session `favoriteCardIds` not synced** — session tracks favorites separately but play page uses global favorites only | SRS §11.7, TSM §10.3 | Partial implementation | Summary shows wrong favorite count |

### 🟡 Moderate Gaps (P0/P1 Features Missing or Incomplete)

| # | Gap | PRD/SRS Ref | Current State | Impact |
|---|---|---|---|---|
| G11 | **No `sortOrder`-based card ordering** — card engine sorts by phase only, doesn't use `sortOrder` as tiebreaker | TSM §14.4 | Partial implementation | Card ordering not deterministic within phases |
| G12 | **Recommendation engine is ad-hoc** — hardcoded in HomePage component instead of a reusable service | TSM §17 | Inline logic | Not reusable, hard to maintain |
| G13 | **Onboarding conditional logic missing** — Step 2 (relationship stage) should only appear for `partner`/`pdkt`, not for `friend`/`family`/`self` | TSM §16.2 | Always shows all 3 steps | UX friction for non-couple users |
| G14 | **No "How It Works" section on Landing Page** | PRD §13.1 | Missing | Users may not understand the product |
| G15 | **No Footer on Landing Page** | PRD §13.1 | Missing | Missing product info |
| G16 | **Deck detail page links to `/decks/[id]` not `/decks/[slug]`** — routes use deck `id` but PRD specifies `slug` | PRD §12, TSM §7 | Using `id` as slug | Works but diverges from spec |
| G17 | **Play page stale `getNextCard` closure** — called inside useEffect with `[sessionId]` dependency; doesn't update when session state changes | Code review | Potential stale state bug | Cards might repeat |
| G18 | **No `framer-motion` / `motion` card transitions** — card flip exists but no smooth enter/exit animations for card changes | PRD §18.1, TSM §5 | CSS transitions only | Play experience less polished |
| G19 | **Missing Deck `slug` field** — deck data uses `id` as both identifier and slug | TSM §10.1 | Id serves as slug | Ok for MVP but diverges from spec |
| G20 | **Summary page links "Play Again" to `/decks/${deck.id}`** — should create a new session directly or link properly | PRD §13.7, SRS §11.11 | Links to deck detail | Extra click for user |

### 🟢 Low Priority / Post-MVP Gaps

| # | Gap | Ref | Priority |
|---|---|---|---|
| G21 | Share Card page (`/share/[cardId]`) | PRD §13.10 | P1 |
| G22 | Premium page (`/premium`) | PRD §13.11 | P2 |
| G23 | Premium badge on deck cards | SRS §11.5 | P2 |
| G24 | Wildcard card visual distinction | SRS §11.8 | P1 |
| G25 | PWA manifest + service worker | TSM §22 | P1 |
| G26 | Analytics event tracking | TSM §20 | P1 |
| G27 | Pause bottom sheet | PRD §10.2 | P1 |
| G28 | Continue session from Home (session restore) | SRS §11.4 | P1 |
| G29 | Keyboard accessibility / aria-labels on icon buttons | SRS §12.3 | P0 (a11y) |

---

## Proposed Changes

We will execute changes in **6 phases**, ordered by dependency. **No style/visual changes** — only data alignment, logic fixes, and missing feature additions.

---

### Phase 1: Data Model Alignment

Align TypeScript types and data files to match TSM specifications exactly, enabling future backend migration.

#### [MODIFY] [index.ts](file:///c:/Users/Falen/Downloads/Convo/src/types/index.ts)

- Rename `Deck.name` → keep `name` but add `slug` field
- Add `isPremium`, `isRecommended`, `colorVariant`, `sortOrder`, `coverIllustration` to `Deck`
- Rename `Card.question` → `content`; add `type`, `sortOrder`, `isActive`, `isPremium` fields
- Rename `OnboardingData` fields: `playingWith` → `relationshipType`, `situation` → `relationshipStage`, `vibe` → `preferredTone`, `completedAt` → `completedOnboarding`
- Add `SessionCardLog` type with `cardId`, `action`, `shownAt`
- Change `Session.currentCardIndex` → `currentCardId`; add `logs: SessionCardLog[]`
- Add `AnonymousUser` type with `id` and `createdAt`
- Rename `SessionStatus` values to include `abandoned`

#### [MODIFY] [decks.ts](file:///c:/Users/Falen/Downloads/Convo/src/data/decks.ts)

- Add `slug`, `isPremium`, `isRecommended`, `colorVariant`, `sortOrder` fields to each deck
- Keep existing `name`, `color`, `icon` for display (mapped from `colorVariant`)
- Add `getDeckBySlug()` to work with slug-based routing

#### [MODIFY] [cards.ts](file:///c:/Users/Falen/Downloads/Convo/src/data/cards.ts)

- Rename `question` → `content` on all cards
- Add `type: 'question'`, `sortOrder`, `isActive: true`, `isPremium: false` to all cards
- Ensure minimum ~30 cards per deck for the 5 MVP decks (Ice Breaker, PDKT, Pacaran, LDR, Pra-Nikah)

---

### Phase 2: Storage Layer Refactor

Split the monolithic storage into separated keys per TSM spec, add anonymous user ID generation.

#### [MODIFY] [storage.ts](file:///c:/Users/Falen/Downloads/Convo/src/utils/storage.ts)

- Implement `STORAGE_KEYS` as defined in TSM §11.1 (`dcc_anonymous_user`, `dcc_onboarding`, `dcc_active_session`, `dcc_session_history`, `dcc_favorites`, `dcc_settings`)
- Add `getOrCreateAnonymousUser()` that generates a unique ID on first visit
- Migrate from single blob to separated keys
- Add `resetOnboarding()` — clears only onboarding data
- Add `resetFavorites()` — clears only favorites
- Add `resetAllData()` — clears everything
- Add session logging: `logCardAction(sessionId, cardId, action)` that appends to session logs
- Add fallback/error handling for corrupt localStorage data
- Add backward compatibility: auto-migrate old `convo_guest_data` format on first read

---

### Phase 3: Card Engine & Session Logic

Implement the proper card selection engine and session management per TSM §14.

#### [NEW] [cardEngine.ts](file:///c:/Users/Falen/Downloads/Convo/src/utils/cardEngine.ts)

- Implement `getNextCard({ deckId, allCards, viewedCardIds, skippedCardIds })` per TSM §14.5
- Filter by `deckId`, `isActive`, exclude viewed/skipped
- Sort by `phase` order (opening → warm → core → reflection), then by `sortOrder`
- Return `null` when no cards remain (end-of-deck)

#### [NEW] [recommendationEngine.ts](file:///c:/Users/Falen/Downloads/Convo/src/utils/recommendationEngine.ts)

- Implement `getRecommendedDecks(decks, preference)` per TSM §17
- Map `relationshipType` + `relationshipStage` to recommended deck slugs
- Extract logic from HomePage into reusable utility

---

### Phase 4: Page Component Updates

Update all page components to use the new data models and utilities. **Preserve all existing styles exactly.**

#### [MODIFY] [LandingPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/LandingPage.tsx)

- Add "How It Works" section (3 simple steps: Pick Deck → Play Cards → Save Favorites)
- Add simple footer (product name, version, privacy note)
- Update field references if `Deck` type changes

#### [MODIFY] [OnboardingPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/OnboardingPage.tsx)

- Rename internal field names to match new types (`relationshipType`, etc.)
- Add conditional logic: skip Step 2 for `friend`, `family`, `self`
- Ensure anonymous user ID is generated on onboarding start

#### [MODIFY] [HomePage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/HomePage.tsx)

- Replace inline recommendation logic with `getRecommendedDecks()` utility
- Update field references (`deck.name` → `deck.name`, `deck.color` → `deck.color`, etc.)
- Display `deck.isRecommended` badge if applicable

#### [MODIFY] [DecksPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/DecksPage.tsx)

- Add filter chips row (Semua, PDKT, Pasangan, LDR, Pra-Nikah, Apresiasi, Konflik, Masa Depan)
- Filter decks based on `deck.category`
- Keep existing deck card styling exactly

#### [MODIFY] [DeckDetailPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/DeckDetailPage.tsx)

- Update `card.question` → `card.content` references
- Add "estimated duration" from deck data
- Ensure "Mulai Deck Ini" creates a proper session with the new session model

#### [MODIFY] [PlayPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/PlayPage.tsx)

- Replace inline `getNextCard` with imported `cardEngine.getNextCard()`
- Fix stale closure issue: properly recalculate available cards after state updates
- Use `card.content` instead of `card.question`
- Log card actions to session logs (`logCardAction`)
- Track `currentCardId` instead of `currentCardIndex`
- Sync session `favoriteCardIds` when toggling favorites

#### [MODIFY] [SummaryPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/SummaryPage.tsx)

- Read favorite count from session's `favoriteCardIds`, not global
- Update field references

#### [MODIFY] [FavoritesPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/FavoritesPage.tsx)

- Update `card.question` → `card.content` references
- Update deck name references

#### [MODIFY] [SettingsPage.tsx](file:///c:/Users/Falen/Downloads/Convo/src/app/pages/SettingsPage.tsx)

- Add "Reset Onboarding" button (separate from "Reset All Data")
- Add "Reset Favorites" button (separate from "Reset All Data")
- Show onboarding status (completed/not completed)
- Add privacy policy placeholder text
- Add contact info placeholder

---

### Phase 5: Content — Expand Cards to MVP Minimum

Each of the 5 MVP decks needs at minimum 30 cards per PRD §16.2.

#### [MODIFY] [cards.ts](file:///c:/Users/Falen/Downloads/Convo/src/data/cards.ts)

- Add cards to reach 30 per deck for: Ice Breaker, PDKT, Pacaran, LDR, Pra-Nikah
- Add cards for remaining 4 decks: Suami-Istri (30), Konflik & Maaf (30), Apresiasi (30), Masa Depan (30)
- All cards must follow content rules: original, natural Indonesian, not too long, appropriate sensitivity
- Distribute across all 4 phases (opening, warm, core, reflection) with proper `sortOrder`
- Total target: **270 cards** (9 decks × 30)
- Update deck `cardCount` to reflect actual counts

---

### Phase 6: Accessibility & Polish

#### [MODIFY] Multiple page files

- Add `aria-label` to all icon buttons (close, favorite, skip, next, back)
- Ensure all touch targets are ≥ 44px × 44px
- Add keyboard navigation support for card actions
- Add `role` attributes where needed
- Respect `prefers-reduced-motion` for card flip animation

---

## Open Questions

> [!IMPORTANT]
> These questions may impact the implementation plan. Please clarify before we proceed.

1. **Framework**: The TSM specifies **Next.js** but the current codebase uses **Vite + React Router**. Should we migrate to Next.js, or continue with Vite? (Recommendation: stay with Vite for MVP since it's already working)

2. **Deck Slug vs ID routing**: Currently routes use deck `id` (e.g., `/decks/ice-breaker`). Since `id` and `slug` are the same value, is this acceptable or do we need to formally separate them?

3. **State Management**: TSM specifies **Zustand** stores. Should we add Zustand, or continue with the current React state + localStorage approach? (Recommendation: add Zustand for proper state management with persistence middleware)

4. **Card content**: Should I generate all 270 cards (30 per deck × 9 decks) with original Indonesian content during this implementation, or is a subset acceptable for initial testing?

5. **Backward compatibility**: When migrating localStorage from `convo_guest_data` to separated `dcc_*` keys, should we auto-migrate existing user data or just start fresh?

6. **Motion library**: The `motion` package (Framer Motion) is already in `package.json`. Should we add card enter/exit animations during this phase, or defer to a polish phase?

---

## Answer for Open Question

1. Migrate to next js

2. Separate them

3. Use zustand

4. Use same question  for card content, its for demo first. Because i need do more research about it.

5. Auto migrate

6. Yes add motion animations    

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no TypeScript compilation errors
- Run the dev server (`npm run dev`) and manually verify each page

### Browser Testing (Manual)
1. **Landing → Onboarding → Home flow**: Complete onboarding, verify redirect to Home
2. **Deck Library**: Verify all decks display with filter chips working
3. **Deck Detail → Play session**: Start deck, flip cards, verify next/skip/favorite
4. **No-repeat logic**: Verify cards don't repeat within a session
5. **End-of-deck**: Play through a deck until all cards are shown
6. **Summary**: Verify correct card counts after session
7. **Favorites**: Verify favorites persist across refresh, filter by deck, remove
8. **Settings**: Test reset onboarding only, reset favorites only, reset all data
9. **Refresh safety**: Refresh during play session, verify session restores
10. **Bottom nav visibility**: Verify hidden on landing, onboarding, play, summary, deck detail

### Data Validation
- Verify all 9 decks have ≥ 30 cards
- Verify all cards have `phase`, `sensitivity`, `topic`, `sortOrder`, `type`, `isActive`
- Verify card engine sorts correctly: opening → warm → core → reflection, then by sortOrder
