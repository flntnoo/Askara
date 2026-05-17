# Software Requirements Specification (SRS)
## Digital Conversation Card App

---

## 1. Document Information

| Item | Detail |
|---|---|
| Product Name | TBD |
| Document Type | Software Requirements Specification |
| Version | v1.0 |
| Platform | Web App / PWA |
| Target Release | MVP |
| Owner | Aldo |
| Status | Draft |
| Last Updated | 2026-05-16 |

---

## 2. Purpose

Dokumen ini menjelaskan kebutuhan perangkat lunak untuk **Digital Conversation Card App**, yaitu aplikasi kartu obrolan digital berbasis web/PWA yang membantu pengguna memulai percakapan yang lebih jujur, seru, hangat, dan bermakna.

SRS ini digunakan sebagai acuan untuk:

- Product owner.
- UI/UX designer.
- Frontend developer.
- QA tester.
- Content writer.
- Stakeholder bisnis.

Dokumen ini menjelaskan kebutuhan fungsional, kebutuhan non-fungsional, struktur data, acceptance criteria, batasan sistem, dan prioritas pengembangan.

---

## 3. Scope

### 3.1 In Scope for MVP

MVP akan mencakup:

- Landing page.
- Guest mode.
- Onboarding ringan.
- Home / deck launcher.
- Deck library.
- Deck detail.
- Start session.
- Play card screen.
- Next card.
- Skip card.
- Favorite card.
- No-repeat card logic dalam satu sesi.
- Session summary.
- Favorites page.
- Settings dasar.
- Local storage persistence.

### 3.2 Out of Scope for MVP

Fitur berikut tidak termasuk MVP:

- Level selection.
- Relationship score.
- Tes kecocokan pasangan.
- Chat antar pengguna.
- Social feed.
- Komentar publik.
- Leaderboard.
- Daily quiz wajib.
- AI therapist.
- Native mobile app Android/iOS.
- Couple mode.
- Admin panel kompleks.
- Payment gateway.
- Real-time sync.

---

## 4. Product Overview

Digital Conversation Card App adalah aplikasi web/PWA yang mengubah pengalaman kartu obrolan fisik menjadi pengalaman digital yang lebih mudah diakses dan dibagikan.

Produk ini menggunakan pendekatan **deck-based experience**. Pengguna tidak memilih level pertanyaan. Pengguna memilih deck sesuai konteks, misalnya:

- Ice Breaker.
- PDKT.
- Pacaran.
- LDR.
- Pra-Nikah.
- Apresiasi.
- Konflik & Ekspektasi.
- Masa Depan.

Kedalaman dan urutan pertanyaan dikendalikan oleh metadata internal seperti `phase`, `topic`, dan `sensitivity`, bukan oleh level selection yang terlihat oleh pengguna.

---

## 5. Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| Deck | Kumpulan kartu berdasarkan tema obrolan tertentu. |
| Card | Satu unit pertanyaan atau instruksi yang ditampilkan kepada pengguna. |
| Question Card | Kartu berisi pertanyaan percakapan. |
| Wildcard | Kartu instruksi atau aktivitas kecil, bukan pertanyaan langsung. |
| Session | Satu sesi bermain kartu berdasarkan deck yang dipilih. |
| Guest Mode | Mode penggunaan tanpa login. |
| Favorite | Kartu yang disimpan oleh pengguna. |
| No-Repeat Logic | Sistem agar kartu yang sama tidak muncul berulang dalam satu sesi. |
| PWA | Progressive Web App, web app yang bisa terasa seperti aplikasi. |
| MVP | Minimum Viable Product. |
| Local Storage | Penyimpanan data lokal di browser pengguna. |

---

## 6. Product Perspective

Aplikasi ini adalah web app mobile-first yang dapat dijalankan di browser modern. Pada MVP, aplikasi tidak membutuhkan backend wajib. Data awal dapat disimpan sebagai static data file dan state pengguna disimpan di browser.

### 6.1 System Context

```txt
User Browser / PWA
↓
Next.js Frontend
↓
Static Deck & Card Data
↓
Client State Store
↓
Local Storage Persistence
```

### 6.2 Future Context

Pada fase berikutnya, sistem dapat berkembang menjadi:

```txt
User Browser / PWA
↓
Next.js Frontend
↓
Backend API
↓
Database
↓
Admin Content Panel
↓
Payment Provider
```

---

## 7. User Classes

### 7.1 Guest User

User yang menggunakan aplikasi tanpa login.

Capabilities:

- Melihat landing page.
- Mengikuti onboarding.
- Melihat deck.
- Memulai session.
- Menjawab kartu secara offline/verbal bersama orang lain.
- Next, skip, favorite kartu.
- Melihat summary.
- Melihat favorites.
- Reset data lokal.

### 7.2 Returning Guest User

User yang pernah menggunakan aplikasi dan memiliki data lokal tersimpan.

Capabilities:

- Melihat rekomendasi berdasarkan onboarding sebelumnya.
- Melanjutkan session aktif.
- Melihat kartu favorit yang tersimpan.

### 7.3 Registered User — Future

User yang login untuk menyimpan data secara permanen.

Capabilities future:

- Sync favorites.
- Restore purchased decks.
- Sync session history.
- Multi-device access.

### 7.4 Admin — Future

User internal yang mengelola konten deck dan kartu.

Capabilities future:

- Create/edit deck.
- Create/edit card.
- Publish/unpublish card.
- Tag card.
- Manage premium deck.

---

## 8. Operating Environment

### 8.1 Client Environment

Sistem harus berjalan pada:

- Mobile browser modern.
- Desktop browser modern.
- Tablet browser modern.

Browser target:

- Chrome latest.
- Safari latest.
- Edge latest.
- Firefox latest.

### 8.2 Device Target

Prioritas utama:

- Smartphone.
- Mobile viewport 360px–480px.

Secondary target:

- Tablet.
- Desktop dengan centered mobile container.

---

## 9. Design Constraints

### 9.1 Visual Direction

Aplikasi menggunakan design system **Vibrant Operator** dengan karakter:

- Light-mode foundation.
- Bold colors.
- High contrast.
- Chunky buttons.
- Sticker-like deck cards.
- Rounded squircle shapes.
- Expressive typography.

### 9.2 Play Screen Constraint

Walaupun visual style bold, play screen wajib tetap fokus.

Play screen tidak boleh menampilkan:

- Bottom navigation.
- Iklan.
- Social feed.
- Komentar publik.
- Relationship score.
- Statistik berat.
- Rekomendasi deck lain.

---

## 10. Assumptions and Dependencies

### 10.1 Assumptions

- User utama mengakses lewat mobile browser.
- User tidak ingin login sebelum mencoba produk.
- Konten kartu sudah tersedia dalam bentuk data awal.
- Jawaban user tidak diketik ke aplikasi.
- Interaksi utama terjadi secara verbal di dunia nyata.

### 10.2 Dependencies

Untuk MVP:

- Next.js.
- TypeScript.
- Tailwind CSS.
- Zustand atau state management sejenis.
- Local storage.
- Static deck/card data.

Untuk future:

- Database.
- Authentication provider.
- Payment provider.
- Admin CMS.
- Analytics provider.

---

# 11. Functional Requirements

Requirement priority:

- **P0**: wajib untuk MVP.
- **P1**: growth/retention setelah MVP.
- **P2**: monetisasi/advanced future.

---

## 11.1 Landing Page Requirements

### FR-LND-001 — View Landing Page

**Priority:** P0  
**Description:** Sistem harus menampilkan landing page saat user membuka `/`.

**Acceptance Criteria:**

- Landing page menampilkan nama produk atau logo.
- Landing page menampilkan headline.
- Landing page menampilkan subheadline.
- Landing page menampilkan CTA utama.
- Landing page menampilkan CTA sekunder.
- Landing page responsive di mobile.

---

### FR-LND-002 — Start Onboarding from Landing

**Priority:** P0  
**Description:** User harus bisa memulai onboarding dari landing page.

**Acceptance Criteria:**

- Tombol “Mulai Bermain” tersedia.
- Klik tombol mengarahkan user ke `/onboarding`.

---

### FR-LND-003 — Browse Decks from Landing

**Priority:** P0  
**Description:** User harus bisa melihat deck tanpa menyelesaikan onboarding.

**Acceptance Criteria:**

- Tombol “Lihat Deck” tersedia.
- Klik tombol mengarahkan user ke `/decks`.

---

## 11.2 Guest Mode Requirements

### FR-GST-001 — Use App Without Login

**Priority:** P0  
**Description:** Sistem harus mengizinkan user memakai aplikasi tanpa login.

**Acceptance Criteria:**

- User bisa melihat deck tanpa login.
- User bisa mulai session tanpa login.
- User bisa favorite card tanpa login.
- User bisa melihat summary tanpa login.

---

### FR-GST-002 — Generate Anonymous User ID

**Priority:** P0  
**Description:** Sistem harus membuat anonymous user ID untuk guest user.

**Acceptance Criteria:**

- Anonymous ID dibuat saat user pertama kali memakai aplikasi.
- Anonymous ID disimpan di local storage.
- Anonymous ID tidak berubah setelah refresh.

---

## 11.3 Onboarding Requirements

### FR-ONB-001 — View Onboarding Page

**Priority:** P0  
**Description:** Sistem harus menampilkan onboarding ringan di `/onboarding`.

**Acceptance Criteria:**

- Onboarding memiliki maksimal 2–3 step.
- Setiap step menampilkan satu pertanyaan utama.
- User bisa memilih jawaban dengan option card.
- User bisa melanjutkan ke step berikutnya.

---

### FR-ONB-002 — Select Relationship Type

**Priority:** P0  
**Description:** User harus bisa memilih dengan siapa mereka ingin bermain.

**Options:**

- Pasangan.
- Gebetan / PDKT.
- Sahabat.
- Keluarga.
- Diri sendiri.

**Acceptance Criteria:**

- User bisa memilih salah satu option.
- Pilihan tersimpan sebagai `relationshipType`.

---

### FR-ONB-003 — Select Relationship Stage

**Priority:** P0  
**Description:** User harus bisa memilih situasi hubungan jika relevan.

**Options:**

- Baru dekat.
- Pacaran.
- LDR.
- Tunangan.
- Menikah.

**Acceptance Criteria:**

- Step ini muncul untuk relationship type yang relevan.
- Pilihan tersimpan sebagai `relationshipStage`.

---

### FR-ONB-004 — Select Preferred Tone

**Priority:** P1  
**Description:** User dapat memilih mood obrolan awal.

**Options:**

- Santai.
- Jujur.
- Seru.
- Serius.

**Acceptance Criteria:**

- Pilihan tersimpan sebagai `preferredTone`.
- Jika user skip, sistem menggunakan default recommendation.

---

### FR-ONB-005 — Skip Onboarding

**Priority:** P0  
**Description:** User harus bisa melewati onboarding.

**Acceptance Criteria:**

- Tombol “Lewati” tersedia.
- User diarahkan ke `/home` atau `/decks`.
- Sistem menggunakan default recommendations.

---

### FR-ONB-006 — Persist Onboarding Preference

**Priority:** P0  
**Description:** Sistem harus menyimpan hasil onboarding di local storage.

**Acceptance Criteria:**

- Data onboarding tetap tersedia setelah refresh.
- Home dapat membaca data onboarding untuk rekomendasi deck.

---

## 11.4 Home Requirements

### FR-HOM-001 — View Home Page

**Priority:** P0  
**Description:** Sistem harus menampilkan home page di `/home`.

**Acceptance Criteria:**

- Home menampilkan greeting.
- Home menampilkan recommended decks.
- Home menampilkan shortcut ke all decks.
- Home menampilkan shortcut ke favorites.

---

### FR-HOM-002 — Continue Active Session

**Priority:** P1  
**Description:** Sistem harus menampilkan active session jika ada.

**Acceptance Criteria:**

- Jika ada session active, tampilkan continue session card.
- Klik continue session mengarah ke `/play/[sessionId]`.
- Jika tidak ada session active, section ini tidak ditampilkan.

---

### FR-HOM-003 — View Recommended Decks

**Priority:** P1  
**Description:** Sistem menampilkan rekomendasi deck berdasarkan onboarding.

**Acceptance Criteria:**

- Recommended decks ditampilkan jika onboarding preference tersedia.
- Jika tidak ada preference, sistem menampilkan default recommended decks.

---

## 11.5 Deck Library Requirements

### FR-DCK-001 — View Deck Library

**Priority:** P0  
**Description:** User harus bisa melihat semua deck di `/decks`.

**Acceptance Criteria:**

- Deck list/grid tampil.
- Setiap deck menampilkan title, description, dan metadata ringkas.
- User bisa membuka deck detail.

---

### FR-DCK-002 — Filter Decks

**Priority:** P1  
**Description:** User dapat memfilter deck berdasarkan kategori.

**Acceptance Criteria:**

- Filter chip tersedia.
- Klik filter memperbarui deck list.
- Filter “Semua” mengembalikan semua deck.

---

### FR-DCK-003 — Show Premium Badge

**Priority:** P2  
**Description:** Sistem harus dapat menandai deck premium.

**Acceptance Criteria:**

- Deck premium menampilkan badge premium.
- Deck free tidak menampilkan badge premium.

---

## 11.6 Deck Detail Requirements

### FR-DDT-001 — View Deck Detail

**Priority:** P0  
**Description:** User harus bisa melihat detail deck di `/decks/[slug]`.

**Acceptance Criteria:**

- Page menampilkan title deck.
- Page menampilkan description deck.
- Page menampilkan jumlah kartu.
- Page menampilkan estimasi durasi.
- Page menampilkan preview kartu.
- Page menampilkan CTA mulai.

---

### FR-DDT-002 — Start Deck Session

**Priority:** P0  
**Description:** User harus bisa memulai session dari deck detail.

**Acceptance Criteria:**

- Klik “Mulai Deck Ini” membuat session baru.
- Session memiliki unique ID.
- User diarahkan ke `/play/[sessionId]`.

---

## 11.7 Session Requirements

### FR-SES-001 — Create Session

**Priority:** P0  
**Description:** Sistem harus membuat session saat user memulai deck.

**Session Data:**

- `id`.
- `deckId`.
- `status`.
- `startedAt`.
- `viewedCardIds`.
- `skippedCardIds`.
- `favoriteCardIds`.
- `logs`.

**Acceptance Criteria:**

- Session tersimpan di local storage.
- Session status default adalah `active`.
- Session terhubung dengan deck ID.

---

### FR-SES-002 — Persist Session

**Priority:** P0  
**Description:** Session harus tetap ada setelah page refresh.

**Acceptance Criteria:**

- Refresh di play screen tidak menghapus session.
- User tetap berada pada konteks session yang sama.

---

### FR-SES-003 — End Session

**Priority:** P0  
**Description:** User harus bisa mengakhiri session.

**Acceptance Criteria:**

- Tombol end session tersedia.
- Sistem dapat meminta konfirmasi.
- Session status berubah menjadi `completed`.
- User diarahkan ke `/summary/[sessionId]`.

---

## 11.8 Play Card Requirements

### FR-PLY-001 — View Play Screen

**Priority:** P0  
**Description:** Sistem harus menampilkan play screen untuk session aktif.

**Acceptance Criteria:**

- Play screen menampilkan satu kartu utama.
- Play screen menampilkan nama deck.
- Play screen menampilkan progress.
- Play screen menampilkan actions: favorite, skip, next, end.
- Bottom navigation tidak tampil.

---

### FR-PLY-002 — Display Question Card

**Priority:** P0  
**Description:** Sistem harus menampilkan question card sesuai deck.

**Acceptance Criteria:**

- Card content terbaca jelas.
- Card berasal dari deck yang dipilih.
- Card belum pernah ditampilkan dalam session yang sama.

---

### FR-PLY-003 — Display Wildcard Card

**Priority:** P1  
**Description:** Sistem dapat menampilkan wildcard card.

**Acceptance Criteria:**

- Wildcard memiliki visual berbeda.
- Wildcard tetap mengikuti deck yang dipilih.
- Wildcard tidak muncul terlalu sering.

---

### FR-PLY-004 — Next Card

**Priority:** P0  
**Description:** User harus bisa melanjutkan ke kartu berikutnya.

**Acceptance Criteria:**

- Klik next mencatat current card sebagai viewed.
- Sistem menampilkan card berikutnya.
- Progress diperbarui.
- Current card tidak muncul lagi dalam session aktif.

---

### FR-PLY-005 — Skip Card

**Priority:** P0  
**Description:** User harus bisa melewati kartu.

**Acceptance Criteria:**

- Klik skip mencatat current card sebagai skipped.
- Sistem menampilkan card berikutnya.
- Skip tidak menampilkan penalti.
- Copy skip terasa aman, misalnya “Lewati dulu”.

---

### FR-PLY-006 — Favorite Card

**Priority:** P0  
**Description:** User harus bisa menyimpan kartu sebagai favorite.

**Acceptance Criteria:**

- Klik favorite menyimpan card ID.
- Favorite icon berubah state.
- Klik ulang menghapus favorite.
- Favorite tampil di `/favorites`.

---

### FR-PLY-007 — End of Deck State

**Priority:** P0  
**Description:** Sistem harus menangani kondisi semua kartu habis.

**Acceptance Criteria:**

- Jika tidak ada kartu tersisa, tampilkan end-of-deck state.
- User bisa menuju summary.
- User bisa kembali ke deck detail.

---

## 11.9 Card Selection Engine Requirements

### FR-CSE-001 — Filter by Deck

**Priority:** P0  
**Description:** Card engine harus mengambil kartu berdasarkan deck ID.

**Acceptance Criteria:**

- Card yang muncul hanya berasal dari deck aktif.

---

### FR-CSE-002 — No Repeat in Session

**Priority:** P0  
**Description:** Card engine tidak boleh menampilkan kartu yang sudah dilihat atau di-skip dalam session yang sama.

**Acceptance Criteria:**

- `viewedCardIds` difilter.
- `skippedCardIds` difilter.
- Card yang sama tidak muncul ulang.

---

### FR-CSE-003 — Internal Phase Ordering

**Priority:** P0  
**Description:** Card engine harus mengurutkan kartu berdasarkan `phase` internal.

**Phase Order:**

1. `opening`.
2. `warm`.
3. `core`.
4. `reflection`.

**Acceptance Criteria:**

- Card opening muncul lebih awal.
- Card reflection muncul lebih akhir.
- Metadata phase tidak ditampilkan ke user.

---

### FR-CSE-004 — Sort Order Fallback

**Priority:** P0  
**Description:** Jika phase sama, card engine menggunakan `sortOrder`.

**Acceptance Criteria:**

- Card dengan sortOrder lebih kecil muncul lebih dulu dalam phase yang sama.

---

## 11.10 Favorites Requirements

### FR-FAV-001 — View Favorites Page

**Priority:** P0  
**Description:** User harus bisa melihat halaman favorites.

**Acceptance Criteria:**

- Page tersedia di `/favorites`.
- Favorite cards tampil.
- Empty state tampil jika belum ada favorite.

---

### FR-FAV-002 — Remove Favorite

**Priority:** P0  
**Description:** User harus bisa menghapus kartu dari favorites.

**Acceptance Criteria:**

- Remove action tersedia.
- Card hilang dari favorites setelah dihapus.
- Data local storage diperbarui.

---

### FR-FAV-003 — Filter Favorites by Deck

**Priority:** P1  
**Description:** User dapat memfilter favorite berdasarkan deck.

**Acceptance Criteria:**

- Filter deck tersedia jika ada favorite dari lebih dari satu deck.
- Filter memperbarui list favorite.

---

## 11.11 Summary Requirements

### FR-SUM-001 — View Session Summary

**Priority:** P0  
**Description:** User harus melihat summary setelah mengakhiri session.

**Acceptance Criteria:**

- Summary menampilkan jumlah kartu dibuka.
- Summary menampilkan jumlah kartu favorite.
- Summary menampilkan nama deck.
- Summary menampilkan CTA main lagi.
- Summary menampilkan CTA lihat favorites.
- Summary tidak menampilkan skor hubungan.

---

## 11.12 Settings Requirements

### FR-SET-001 — View Settings

**Priority:** P0  
**Description:** User harus bisa membuka settings.

**Acceptance Criteria:**

- Page tersedia di `/settings`.
- Page menampilkan status guest.
- Page menampilkan reset onboarding.
- Page menampilkan reset local data.

---

### FR-SET-002 — Reset Onboarding

**Priority:** P0  
**Description:** User harus bisa reset onboarding preference.

**Acceptance Criteria:**

- Klik reset menghapus onboarding preference.
- User bisa melakukan onboarding ulang.

---

### FR-SET-003 — Reset Local Data

**Priority:** P0  
**Description:** User harus bisa menghapus data lokal.

**Acceptance Criteria:**

- Klik reset local data menghapus session dan favorites.
- Sistem meminta konfirmasi sebelum reset.

---

## 11.13 Share Requirements

### FR-SHR-001 — Open Share Card Page

**Priority:** P1  
**Description:** User dapat membuka share preview untuk card tertentu.

**Acceptance Criteria:**

- Page tersedia di `/share/[cardId]`.
- Card preview tampil.
- Jika card ID tidak valid, tampilkan error state.

---

### FR-SHR-002 — Download Share Image

**Priority:** P1  
**Description:** User dapat mengunduh gambar share card.

**Acceptance Criteria:**

- Download button tersedia.
- Output image sesuai template.
- Text tetap terbaca.

---

## 11.14 Premium Requirements

### FR-PRM-001 — Show Premium Deck

**Priority:** P2  
**Description:** Sistem dapat menampilkan deck premium.

**Acceptance Criteria:**

- Premium badge tampil.
- Deck premium dapat dibedakan dari free deck.

---

### FR-PRM-002 — Show Paywall

**Priority:** P2  
**Description:** Sistem dapat menampilkan paywall untuk deck premium.

**Acceptance Criteria:**

- Paywall menjelaskan benefit.
- Paywall menampilkan preview deck.
- User tidak dapat membuka semua kartu premium tanpa unlock.

---

# 12. Non-Functional Requirements

---

## 12.1 Performance Requirements

### NFR-PER-001 — Fast Initial Load

Landing page harus terasa cepat pada koneksi mobile.

**Acceptance Criteria:**

- Initial load tidak menggunakan asset besar yang tidak perlu.
- Static data dioptimalkan.
- Image dan illustration dikompresi.

---

### NFR-PER-002 — Instant Card Transition

Transisi kartu harus terasa responsif.

**Acceptance Criteria:**

- Klik next/skip menampilkan kartu berikutnya tanpa delay signifikan.
- Animation tidak menghambat interaksi.

---

## 12.2 Usability Requirements

### NFR-USB-001 — Mobile First

UI harus dioptimalkan untuk mobile.

**Acceptance Criteria:**

- Semua halaman nyaman digunakan pada width 360px.
- Touch target minimal 44px x 44px.
- Text question card mudah dibaca.

---

### NFR-USB-002 — Low Friction

User harus bisa mencoba produk tanpa login.

**Acceptance Criteria:**

- Tidak ada login wall sebelum play.
- User bisa melewati onboarding.
- User bisa memulai deck dalam beberapa klik.

---

## 12.3 Accessibility Requirements

### NFR-ACC-001 — Readable Text

Text harus mudah dibaca.

**Acceptance Criteria:**

- Body text minimal 16px.
- Question text lebih besar dari body text.
- Contrast memadai antara text dan background.

---

### NFR-ACC-002 — Accessible Buttons

Button dan icon button harus accessible.

**Acceptance Criteria:**

- Icon button memiliki aria-label.
- Button dapat diakses keyboard.
- State active tidak hanya bergantung pada warna.

---

### NFR-ACC-003 — Motion Safety

Animasi harus lembut dan tidak berlebihan.

**Acceptance Criteria:**

- Animasi card transition tidak terlalu cepat atau ekstrem.
- Sistem dapat menghormati preferensi reduce motion jika diimplementasikan.

---

## 12.4 Privacy Requirements

### NFR-PRV-001 — No User Answer Storage

MVP tidak boleh menyimpan jawaban pribadi user.

**Acceptance Criteria:**

- Tidak ada input untuk jawaban pribadi.
- Tidak ada penyimpanan curhatan atau catatan hubungan.
- Data yang disimpan hanya metadata penggunaan.

---

### NFR-PRV-002 — Local Data Transparency

User harus bisa menghapus data lokal.

**Acceptance Criteria:**

- Settings menyediakan reset local data.
- Reset local data menghapus session dan favorites.

---

## 12.5 Reliability Requirements

### NFR-REL-001 — Refresh Safe

Aplikasi harus tetap berjalan setelah refresh.

**Acceptance Criteria:**

- Session aktif tetap tersedia.
- Favorite tetap tersedia.
- Onboarding preference tetap tersedia.

---

### NFR-REL-002 — Invalid Route Handling

Sistem harus menangani route invalid.

**Acceptance Criteria:**

- Invalid deck slug menampilkan not found state.
- Invalid session ID menampilkan recovery state.
- Invalid card ID menampilkan error state.

---

## 12.6 Maintainability Requirements

### NFR-MNT-001 — Typed Data Models

Sistem harus menggunakan TypeScript types untuk deck, card, dan session.

**Acceptance Criteria:**

- Deck memiliki type.
- Card memiliki type.
- Session memiliki type.
- Data static harus sesuai type.

---

### NFR-MNT-002 — Feature-Based Structure

Kode frontend sebaiknya menggunakan struktur feature-based.

**Acceptance Criteria:**

- Logic deck berada di feature deck.
- Logic session berada di feature session.
- Logic favorite berada di feature favorite.
- UI reusable berada di components.

---

# 13. Data Requirements

---

## 13.1 Deck Model

```ts
type DeckCategory =
  | "ice-breaker"
  | "pdkt"
  | "pacaran"
  | "ldr"
  | "pra-nikah"
  | "apresiasi"
  | "konflik"
  | "masa-depan";

type Deck = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: DeckCategory;
  cardCount: number;
  estimatedMinutes: number;
  isPremium: boolean;
  isRecommended?: boolean;
  colorVariant: "primary" | "secondary" | "tertiary" | "dark" | "light";
  coverIllustration?: string;
};
```

---

## 13.2 Card Model

```ts
type CardType = "question" | "wildcard";

type CardTopic =
  | "intro"
  | "values"
  | "family"
  | "finance"
  | "conflict"
  | "future"
  | "appreciation"
  | "distance"
  | "commitment"
  | "intimacy";

type CardSensitivity = "low" | "medium" | "high";

type CardPhase = "opening" | "warm" | "core" | "reflection";

type ConversationCard = {
  id: string;
  deckId: string;
  type: CardType;
  topic: CardTopic;
  sensitivity: CardSensitivity;
  phase: CardPhase;
  content: string;
  isPremium: boolean;
  sortOrder: number;
};
```

---

## 13.3 Session Model

```ts
type SessionStatus = "active" | "completed" | "abandoned";

type CardAction = "viewed" | "skipped" | "favorited";

type SessionCardLog = {
  cardId: string;
  action: CardAction;
  shownAt: string;
};

type CardSession = {
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

## 13.4 Onboarding Preference Model

```ts
type RelationshipType = "partner" | "pdkt" | "friend" | "family" | "self";

type RelationshipStage = "new" | "dating" | "ldr" | "engaged" | "married";

type PreferredTone = "casual" | "honest" | "fun" | "serious";

type OnboardingPreference = {
  relationshipType?: RelationshipType;
  relationshipStage?: RelationshipStage;
  preferredTone?: PreferredTone;
  completedOnboarding: boolean;
};
```

---

# 14. Local Storage Requirements

---

## 14.1 Storage Keys

| Key | Description |
|---|---|
| `dcc.anonymousUserId` | Anonymous guest user ID. |
| `dcc.onboardingPreference` | Saved onboarding data. |
| `dcc.sessions` | All local sessions. |
| `dcc.activeSessionId` | Current active session ID. |
| `dcc.favoriteCardIds` | Favorite card IDs. |
| `dcc.settings` | Local user settings. |

---

## 14.2 Storage Behavior

- Data harus persist setelah refresh.
- Data harus bisa dihapus dari settings.
- Data tidak boleh menyimpan jawaban pribadi.
- Data harus aman dari parsing error dengan fallback default.

---

# 15. App Routes

| Route | Page | Priority |
|---|---|---|
| `/` | Landing page | P0 |
| `/onboarding` | Onboarding | P0 |
| `/home` | Home / Deck Launcher | P0 |
| `/decks` | Deck Library | P0 |
| `/decks/[slug]` | Deck Detail | P0 |
| `/play/[sessionId]` | Play Card Screen | P0 |
| `/summary/[sessionId]` | Session Summary | P0 |
| `/favorites` | Favorites | P0 |
| `/settings` | Settings | P0 |
| `/share/[cardId]` | Share Card | P1 |
| `/premium` | Premium | P2 |

---

# 16. Navigation Requirements

## 16.1 Bottom Navigation

Bottom navigation tampil di:

- `/home`.
- `/decks`.
- `/favorites`.
- `/settings`.
- `/premium`.

Menu:

- Home.
- Decks.
- Favorites.
- Settings.

## 16.2 No Bottom Navigation

Bottom navigation tidak tampil di:

- `/`.
- `/onboarding`.
- `/decks/[slug]`.
- `/play/[sessionId]`.
- `/summary/[sessionId]`.
- `/share/[cardId]`.

---

# 17. Analytics Requirements

Analytics bersifat opsional untuk prototipe, tetapi direkomendasikan untuk MVP public test.

## 17.1 Events

| Event | Trigger |
|---|---|
| `landing_viewed` | Landing page dibuka. |
| `onboarding_started` | User mulai onboarding. |
| `onboarding_completed` | User selesai onboarding. |
| `deck_library_viewed` | User membuka deck library. |
| `deck_viewed` | User membuka deck detail. |
| `session_started` | User memulai session. |
| `card_viewed` | Card tampil di play screen. |
| `card_skipped` | User skip card. |
| `card_favorited` | User favorite card. |
| `session_completed` | User menyelesaikan session. |
| `favorites_viewed` | User membuka favorites. |
| `share_clicked` | User klik share. |

---

# 18. Error and Empty States

## 18.1 Empty Favorites

Copy:

```txt
Belum ada kartu yang disimpan.
Simpan pertanyaan yang ingin kamu bahas lagi nanti.
```

## 18.2 End of Deck

Copy:

```txt
Kamu sudah membuka semua kartu di deck ini.
```

## 18.3 Invalid Deck

Copy:

```txt
Deck tidak ditemukan.
```

## 18.4 Invalid Session

Copy:

```txt
Sesi tidak ditemukan atau sudah berakhir.
```

## 18.5 Local Storage Error

Copy:

```txt
Data lokal tidak bisa dibaca. Kamu bisa mulai ulang sesi.
```

---

# 19. Content Requirements

## 19.1 Initial Decks

MVP initial decks:

- Ice Breaker.
- PDKT.
- Pacaran.
- LDR.
- Pra-Nikah.

## 19.2 Minimum Card Count

| Deck | Minimum Cards |
|---|---:|
| Ice Breaker | 30 |
| PDKT | 30 |
| Pacaran | 30 |
| LDR | 30 |
| Pra-Nikah | 30 |

Total minimum: 150 cards.

## 19.3 Content Rules

- Semua pertanyaan harus original.
- Tidak boleh menyalin dari produk kartu fisik yang sudah ada.
- Tidak boleh melakukan parafrase ringan dari brand lain.
- Pertanyaan harus natural dalam bahasa Indonesia.
- Pertanyaan harus sesuai konteks deck.
- Pertanyaan tidak boleh terlalu panjang.
- Pertanyaan sensitif harus diberi metadata `sensitivity`.

---

# 20. Security and Privacy Requirements

## 20.1 Data Minimization

Sistem hanya menyimpan data minimum yang dibutuhkan.

Allowed:

- Viewed card IDs.
- Skipped card IDs.
- Favorite card IDs.
- Onboarding preference.
- Active session ID.

Not allowed in MVP:

- Jawaban pribadi user.
- Catatan hubungan.
- Chat.
- Confession text.

## 20.2 Local Data Reset

User harus bisa menghapus data lokal melalui settings.

---

# 21. PWA Requirements

PWA masuk P1, tetapi struktur app harus siap untuk PWA.

## 21.1 PWA Installability

Future requirements:

- Manifest file tersedia.
- App icon tersedia.
- Theme color sesuai design system.
- User dapat install ke home screen jika browser mendukung.

## 21.2 Offline Support

Future requirements:

- Static deck tertentu dapat di-cache.
- App shell dapat dibuka saat offline.
- Offline state tersedia jika data tidak bisa dimuat.

---

# 22. Quality Assurance Requirements

## 22.1 Functional Test Checklist

- User bisa membuka landing page.
- User bisa memulai onboarding.
- User bisa skip onboarding.
- User bisa melihat home.
- User bisa melihat deck library.
- User bisa membuka deck detail.
- User bisa memulai session.
- User bisa melihat kartu.
- User bisa next card.
- User bisa skip card.
- User bisa favorite card.
- User bisa end session.
- User bisa melihat summary.
- User bisa melihat favorites.
- User bisa reset local data.

## 22.2 Regression Test Checklist

- Refresh tidak menghapus session.
- Refresh tidak menghapus favorites.
- Card tidak berulang dalam satu session.
- Invalid route ditangani dengan baik.
- Mobile layout tetap rapi.

---

# 23. Traceability Matrix

| Requirement Group | Related Page | Priority |
|---|---|---|
| Landing | `/` | P0 |
| Onboarding | `/onboarding` | P0 |
| Guest Mode | Global | P0 |
| Deck Library | `/decks` | P0 |
| Deck Detail | `/decks/[slug]` | P0 |
| Session | `/play/[sessionId]` | P0 |
| Card Engine | `/play/[sessionId]` | P0 |
| Favorites | `/favorites` | P0 |
| Summary | `/summary/[sessionId]` | P0 |
| Settings | `/settings` | P0 |
| Share | `/share/[cardId]` | P1 |
| Premium | `/premium` | P2 |

---

# 24. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Onboarding terasa terlalu panjang | User drop-off | Maksimal 2–3 step dan sediakan skip. |
| Pertanyaan terasa terlalu berat | User tidak nyaman | Gunakan skip, phase, sensitivity, dan deck context. |
| UI terlalu ramai | Play experience terganggu | Play screen hanya satu kartu. |
| Data local storage corrupt | Session error | Gunakan fallback dan reset option. |
| Konten terasa generik | Engagement rendah | Tulis pertanyaan original dan kontekstual. |
| Mirip produk lain | Risiko HKI | Semua konten dibuat dari nol. |
| User tidak kembali | Retention rendah | Tambahkan continue session dan favorite. |

---

# 25. Open Questions

- Apa nama final produk?
- Apakah onboarding wajib atau optional?
- Apakah Step 3 onboarding masuk MVP atau P1?
- Apakah share card masuk MVP public test atau P1?
- Apakah Pra-Nikah menjadi free deck atau premium deck?
- Apakah data awal cukup dari static file atau langsung database?
- Apakah analytics langsung diaktifkan pada MVP?
- Apakah PWA install prompt langsung dibuat di MVP?
- Apakah desktop layout hanya centered mobile container?

---

# 26. MVP Acceptance Summary

MVP dianggap memenuhi kebutuhan jika:

- User bisa menggunakan aplikasi tanpa login.
- User bisa menyelesaikan onboarding ringan atau melewatinya.
- User bisa memilih deck.
- User bisa memulai session.
- User bisa melihat satu kartu dalam play screen.
- User bisa next, skip, dan favorite kartu.
- Kartu tidak berulang dalam satu session.
- User bisa mengakhiri session.
- User bisa melihat summary.
- User bisa melihat favorites.
- Data tetap tersedia setelah refresh.
- Tidak ada level selection.
- Tidak ada skor hubungan.

---

# 27. Final Requirement Statement

Sistem harus menyediakan pengalaman kartu obrolan digital yang cepat dibuka, mudah dimainkan, guest-first, deck-based, dan minim distraksi.

Core flow:

```txt
Landing
↓
Onboarding Ringan
↓
Home
↓
Choose Deck
↓
Deck Detail
↓
Play Card
↓
Next / Skip / Favorite
↓
Summary
↓
Favorites / Play Again
```

MVP focus:

```txt
Guest Mode
Deck Library
Deck Detail
Play Card
Next
Skip
Favorite
No-Repeat
Session Summary
Favorites Page
```

