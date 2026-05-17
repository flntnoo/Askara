# Product Requirements Document
## Digital Conversation Card App

---

## 1. Document Info

| Item | Detail |
|---|---|
| Product Name | TBD |
| Document Type | Product Requirements Document |
| Version | v1.0 |
| Platform | Web App / PWA |
| Target Release | MVP |
| Owner | Aldo |
| Status | Draft |

---

## 2. Product Summary

Digital Conversation Card App adalah aplikasi kartu obrolan digital berbasis web/PWA yang membantu pengguna memulai percakapan yang lebih jujur, seru, hangat, dan bermakna.

Produk ini mengambil pengalaman dari kartu fisik, lalu mengubahnya menjadi pengalaman digital yang lebih mudah dijangkau, lebih mudah dibagikan, dan bisa langsung digunakan dari browser tanpa perlu install aplikasi terlebih dahulu.

Aplikasi ini menggunakan pendekatan **deck-based experience**, bukan level-based experience. Artinya, pengguna tidak memilih level pertanyaan. Pengguna cukup memilih tipe deck seperti PDKT, Pacaran, LDR, Pra-Nikah, atau Apresiasi, lalu sistem akan menampilkan kartu yang sesuai dengan konteks deck tersebut.

---

## 3. Background

Produk kartu obrolan fisik untuk pasangan dan hubungan interpersonal memiliki daya tarik besar karena mampu membantu orang memulai percakapan yang biasanya sulit dimulai secara natural.

Namun, produk fisik memiliki beberapa keterbatasan:

- Harus dibeli dan dikirim secara fisik.
- Akses terbatas pada orang yang memiliki kartu.
- Jumlah kartu terbatas.
- Sulit diperbarui.
- Sulit dibagikan secara digital.
- Tidak memiliki fitur penyimpanan kartu favorit.
- Tidak memiliki sistem riwayat atau no-repeat.

Versi digital membuka peluang untuk:

- Akses lebih luas.
- Distribusi lebih cepat melalui link.
- Penggunaan langsung lewat browser.
- Kartu bisa diperbarui.
- Deck bisa ditambah secara bertahap.
- Kartu bisa disimpan sebagai favorit.
- Kartu bisa dibagikan ke media sosial.
- Model monetisasi bisa dibuat melalui premium deck.

---

## 4. Problem Statement

Banyak orang ingin memiliki percakapan yang lebih jujur dan bermakna dengan pasangan, gebetan, sahabat, atau keluarga, tetapi sering tidak tahu harus memulai dari mana.

Di sisi lain, kartu obrolan fisik tidak selalu mudah diakses karena harus dibeli, dikirim, dan dibawa secara fisik.

Produk ini ingin menjawab masalah tersebut dengan membuat pengalaman kartu obrolan yang:

- Cepat dibuka.
- Mudah dimainkan.
- Tidak membutuhkan login di awal.
- Bisa digunakan lewat HP.
- Bisa dibagikan.
- Memiliki konten yang relevan berdasarkan tipe hubungan.

---

## 5. Product Goals

### 5.1 Business Goals

- Memvalidasi minat pasar terhadap kartu obrolan digital.
- Membuat produk yang mudah disebarkan melalui Instagram, TikTok, WhatsApp, dan link bio.
- Membangun foundation untuk monetisasi melalui premium deck.
- Membangun brand digital card game yang playful, bold, dan relatable untuk pasar Indonesia.

### 5.2 User Goals

- User bisa langsung mencoba tanpa login.
- User bisa memilih deck sesuai situasi hubungan.
- User bisa bermain kartu dengan mudah.
- User bisa melewati pertanyaan yang belum siap dijawab.
- User bisa menyimpan pertanyaan penting.
- User bisa mengakhiri sesi dan melihat ringkasan ringan.
- User bisa membagikan kartu tertentu ke media sosial.

### 5.3 Product Goals

- Menghadirkan pengalaman kartu digital yang sederhana dan fokus.
- Menghindari pengalaman yang terasa seperti kuis, tes hubungan, atau tugas harian.
- Menggunakan visual yang bold, fun, dan shareable.
- Memastikan play screen tetap fokus pada satu kartu dan minim distraksi.
- Menggunakan struktur deck, bukan level selection.

---

## 6. Non-Goals

Hal-hal berikut tidak termasuk dalam MVP:

- Level selection.
- Tes kecocokan pasangan.
- Skor hubungan.
- Chat antar pengguna.
- Social feed.
- Komentar publik.
- Leaderboard.
- AI therapist.
- Daily quiz wajib.
- Couple account.
- Sinkronisasi real-time dengan pasangan.
- Admin panel kompleks.
- Native mobile app Android/iOS.

---

## 7. Target Users

### 7.1 Primary Users

#### Pasangan Muda

- Usia 18–35 tahun.
- Ingin komunikasi lebih terbuka.
- Sering menggunakan Instagram, TikTok, dan WhatsApp.
- Tertarik pada konten relationship, self-growth, dan emotional connection.

#### PDKT / Orang yang Baru Dekat

- Ingin mengenal satu sama lain dengan cara yang lebih seru.
- Butuh pertanyaan pembuka yang tidak terlalu kaku.
- Mencari aktivitas ringan untuk date night atau chat.

#### Pasangan LDR

- Butuh cara menjaga kedekatan meskipun berjauhan.
- Bisa menggunakan kartu sebagai bahan video call atau voice call.

### 7.2 Secondary Users

#### Sahabat

- Ingin ngobrol lebih dalam.
- Cocok untuk hangout, sleepover, atau sesi refleksi bersama.

#### Pasangan Pra-Nikah

- Ingin membahas topik penting seperti finansial, keluarga, konflik, dan masa depan.

---

## 8. Positioning

### 8.1 Product Positioning

Kartu obrolan digital yang bold, seru, dan mudah dibagikan untuk membantu orang memulai percakapan yang biasanya susah dimulai.

### 8.2 Positioning Statement

> Obrolan yang biasanya susah dimulai, sekarang cukup dari satu kartu.

### 8.3 Product Personality

Produk harus terasa:

- Bold
- Playful
- Honest
- Modern
- Shareable
- Relationship-focused
- Warm but not too soft
- Fun but not shallow

Produk tidak boleh terasa:

- Terlalu klinis
- Terlalu terapeutik
- Terlalu serius
- Seperti dashboard
- Seperti ujian hubungan
- Seperti aplikasi produktivitas

---

## 9. Design Direction

Produk menggunakan design system **Vibrant Operator**.

### 9.1 Visual Characteristics

- Light-mode foundation.
- High-contrast layout.
- Bold color blocks.
- Chunky buttons.
- Sticker-like deck cards.
- Rounded squircle shapes.
- Expressive typography.
- Strong visual identity.

### 9.2 Design Rules

- Play screen harus tetap fokus pada satu kartu.
- Jangan tampilkan terlalu banyak menu di layar bermain.
- Jangan tampilkan bottom navigation saat play mode.
- Jangan tampilkan iklan saat sesi berlangsung.
- Jangan tampilkan skor hubungan.
- Jangan tampilkan statistik yang terlalu berat.
- Gunakan visual bold untuk membuat produk terasa fun dan shareable, bukan chaotic.

### 9.3 Main Color Usage

| Color Role | Usage |
|---|---|
| Primary / Orange | CTA utama, featured deck, active card |
| Secondary / Purple | Deck kategori, onboarding option, secondary highlight |
| Tertiary / Yellow | Wildcard, premium, special prompt |
| Charcoal | Text, icon, border, secondary button |
| Light Surface | Background utama |

---

## 10. Product Scope

### 10.1 MVP Scope

MVP harus mencakup:

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
- No-repeat in session.
- Session summary.
- Favorites page.

### 10.2 Post-MVP Scope

Fitur setelah MVP:

- Wildcard card.
- Share card.
- Pause bottom sheet.
- Continue session.
- Recommended deck.
- PWA install prompt.
- Premium deck.
- Paywall.
- Payment integration.
- Login opsional.
- Admin content panel.

---

## 11. Core User Flow

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
Start Session
↓
Play Card
↓
Next / Skip / Favorite
↓
End Session
↓
Summary
↓
Favorites / Share / Play Again
```

---

## 12. Sitemap

```txt
PUBLIC
└── /
    ├── CTA: Mulai Bermain → /onboarding
    └── CTA: Lihat Deck → /decks

SETUP
└── /onboarding
    └── selesai → /home

MAIN APP
├── /home
│   ├── continue session → /play/[sessionId]
│   ├── recommended deck → /decks/[slug]
│   └── all decks → /decks
│
├── /decks
│   └── pilih deck → /decks/[slug]
│
├── /decks/[slug]
│   └── mulai deck → /play/[sessionId]
│
├── /favorites
│   ├── buka kartu
│   └── share card → /share/[cardId]
│
└── /settings

PLAY MODE
├── /play/[sessionId]
│   ├── next card
│   ├── skip card
│   ├── favorite card
│   ├── pause
│   └── end session → /summary/[sessionId]
│
└── /summary/[sessionId]
    ├── main lagi → /decks/[slug]
    ├── lihat favorit → /favorites
    └── home → /home

GROWTH
└── /share/[cardId]

MONETIZATION
└── /premium
```

---

## 13. Page Requirements

### 13.1 Landing Page

#### Purpose

Mengenalkan produk dan mengarahkan user untuk mulai bermain.

#### Route

```txt
/
```

#### Content

- Logo / brand name.
- Headline.
- Subheadline.
- CTA utama.
- CTA sekunder.
- Preview kartu atau deck.
- How it works.
- Footer sederhana.

#### Example Copy

```txt
Obrolan yang biasanya susah dimulai, sekarang cukup dari satu kartu.
```

#### Primary CTA

```txt
Mulai Bermain → /onboarding
```

#### Secondary CTA

```txt
Lihat Deck → /decks
```

#### Acceptance Criteria

- User memahami fungsi produk dalam 5–10 detik.
- User bisa masuk ke onboarding.
- User bisa melihat deck tanpa onboarding.
- Page mobile-friendly.
- CTA terlihat jelas.

---

### 13.2 Onboarding Page

#### Purpose

Mengumpulkan konteks ringan untuk merekomendasikan deck.

#### Route

```txt
/onboarding
```

#### Onboarding Questions

##### Step 1

```txt
Kamu ingin bermain dengan siapa?
```

Options:

- Pasangan
- Gebetan / PDKT
- Sahabat
- Keluarga
- Diri sendiri

##### Step 2

```txt
Situasi kalian sekarang?
```

Options:

- Baru dekat
- Pacaran
- LDR
- Tunangan
- Menikah

##### Step 3 Optional

```txt
Mau mulai dari obrolan seperti apa?
```

Options:

- Santai
- Jujur
- Seru
- Serius

#### Data Stored

- relationship_type
- relationship_stage
- preferred_tone

#### Acceptance Criteria

- Onboarding maksimal 2–3 step.
- User bisa menyelesaikan onboarding tanpa login.
- User bisa skip onboarding jika diperlukan.
- Hasil onboarding tersimpan di local storage.
- User diarahkan ke `/home` setelah selesai.

---

### 13.3 Home Page

#### Purpose

Menjadi deck launcher utama.

#### Route

```txt
/home
```

#### Content

- Greeting.
- Continue session card jika ada sesi aktif.
- Recommended decks.
- All decks preview.
- Shortcut ke favorites.
- Shortcut ke settings.

#### Example Headline

```txt
Mau ngobrolin apa hari ini?
```

#### Acceptance Criteria

- User bisa melihat rekomendasi deck.
- User bisa melanjutkan sesi aktif.
- User bisa menuju deck detail.
- User bisa menuju favorites.
- Bottom navigation tampil di halaman ini.

---

### 13.4 Deck Library Page

#### Purpose

Menampilkan semua deck yang tersedia.

#### Route

```txt
/decks
```

#### Content

- Page title.
- Filter chips.
- Deck grid.
- Free/premium badge.
- Recommended badge jika ada.

#### Filter Options

- Semua
- PDKT
- Pasangan
- LDR
- Pra-Nikah
- Apresiasi
- Konflik
- Masa Depan

#### Acceptance Criteria

- User bisa melihat semua deck.
- User bisa filter deck berdasarkan kategori.
- User bisa membuka deck detail.
- Bottom navigation tampil di halaman ini.

---

### 13.5 Deck Detail Page

#### Purpose

Memberi konteks sebelum user memulai deck.

#### Route

```txt
/decks/[slug]
```

#### Content

- Deck title.
- Deck description.
- Card count.
- Estimated duration.
- Suitable audience.
- Topics covered.
- Preview 2–3 cards.
- Start deck CTA.

#### Example

```txt
Pra-Nikah

Bahas ekspektasi, keluarga, finansial, konflik, dan masa depan sebelum melangkah lebih jauh.

50 kartu · 25–40 menit
```

#### Acceptance Criteria

- User memahami isi deck sebelum mulai.
- User bisa melihat preview kartu.
- User bisa mulai sesi.
- Start session membuat session ID.
- Setelah klik start, user diarahkan ke `/play/[sessionId]`.

---

### 13.6 Play Card Screen

#### Purpose

Menampilkan satu kartu pertanyaan dalam satu waktu.

#### Route

```txt
/play/[sessionId]
```

#### Layout

```txt
Deck Name        Progress

[ Question Card ]

Favorite     Skip     Next
```

#### Required Actions

- Next.
- Skip.
- Favorite.
- End session.
- Pause, jika P1 sudah masuk.

#### Rules

Jangan tampilkan:

- Bottom navigation.
- Iklan.
- Skor hubungan.
- Statistik berat.
- Rekomendasi deck lain.
- Social feed.
- Komentar publik.

#### Acceptance Criteria

- Hanya satu kartu utama tampil di layar.
- User bisa lanjut ke kartu berikutnya.
- User bisa skip kartu.
- User bisa favorite kartu.
- User bisa mengakhiri sesi.
- Kartu yang sudah dilihat tidak muncul lagi dalam sesi yang sama.
- Jika semua kartu habis, user diarahkan ke summary atau end-of-deck state.

---

### 13.7 Session Summary Page

#### Purpose

Menutup sesi dengan ringkasan ringan.

#### Route

```txt
/summary/[sessionId]
```

#### Content

- Jumlah kartu dibuka.
- Jumlah kartu disimpan.
- Deck yang dimainkan.
- CTA main lagi.
- CTA lihat favorites.
- CTA kembali home.

#### Example Copy

```txt
Kalian baru saja membuka 14 obrolan dari deck Pra-Nikah.
```

#### Do Not Include

- Skor hubungan.
- Persentase kecocokan.
- Penilaian pasangan.
- Ranking.
- Leaderboard.

#### Acceptance Criteria

- Summary muncul setelah sesi selesai.
- Tidak ada skor hubungan.
- User bisa kembali ke home.
- User bisa lihat favorites.
- User bisa main lagi.

---

### 13.8 Favorites Page

#### Purpose

Menampilkan kartu yang disimpan user.

#### Route

```txt
/favorites
```

#### Content

- List favorite cards.
- Filter by deck.
- Remove favorite.
- Open card again.
- Empty state.

#### Empty State Copy

```txt
Belum ada kartu yang disimpan.
Simpan pertanyaan yang ingin kamu bahas lagi nanti.
```

#### Acceptance Criteria

- User bisa melihat kartu favorit.
- User bisa menghapus favorite.
- User bisa filter berdasarkan deck.
- Data favorite tersimpan walau page di-refresh.
- Bottom navigation tampil di halaman ini.

---

### 13.9 Settings Page

#### Purpose

Mengatur preferensi dasar.

#### Route

```txt
/settings
```

#### Content

- Guest status.
- Reset onboarding.
- Reset progress.
- Theme preference.
- About product.
- Privacy policy.
- Contact.

#### Acceptance Criteria

- User bisa reset onboarding.
- User bisa reset local data.
- User bisa melihat status guest.
- Bottom navigation tampil di halaman ini.

---

### 13.10 Share Card Page

#### Purpose

Membuat kartu bisa dibagikan ke media sosial.

#### Route

```txt
/share/[cardId]
```

#### Content

- Share card preview.
- Template selector.
- Download button.
- Share button.
- Copy link button.

#### Format

- Instagram Story: 1080 x 1920.
- Square post: 1080 x 1080.

#### Acceptance Criteria

- User bisa melihat preview kartu.
- User bisa memilih template.
- User bisa download gambar.
- User bisa share jika browser/device mendukung.

#### Priority

P1

---

### 13.11 Premium Page

#### Purpose

Menampilkan penawaran deck premium.

#### Route

```txt
/premium
```

#### Content

- Premium hero.
- List premium deck.
- Benefit.
- CTA unlock.
- FAQ sederhana.

#### Priority

P2

---

## 14. Feature Requirements

### 14.1 Guest Mode

#### Description

User bisa memakai aplikasi tanpa membuat akun.

#### Functional Requirements

- Generate anonymous user ID di local storage.
- Simpan onboarding answer secara lokal.
- Simpan session progress secara lokal.
- Simpan favorite card secara lokal.
- Data tetap ada setelah refresh browser.

#### Acceptance Criteria

- User bisa mulai bermain tanpa login.
- User bisa favorite kartu tanpa login.
- User bisa kembali ke session aktif tanpa login.
- Data tidak hilang setelah refresh.

---

### 14.2 Start Session

#### Description

Session dibuat saat user klik “Mulai Deck Ini”.

#### Functional Requirements

Session harus menyimpan:

- Session ID.
- Deck ID.
- Started at.
- Status.
- Viewed card IDs.
- Skipped card IDs.
- Favorite card IDs.

#### Acceptance Criteria

- Session ID dibuat saat deck dimulai.
- User diarahkan ke play page.
- Session status default adalah active.
- Session tersimpan di local storage.

---

### 14.3 Card Selection Engine

#### Description

Sistem memilih kartu berikutnya berdasarkan deck dan riwayat session.

#### Functional Requirements

- Ambil kartu berdasarkan deck ID.
- Filter kartu yang sudah dilihat.
- Filter kartu yang sudah di-skip.
- Urutkan berdasarkan phase internal.
- Jika phase sama, gunakan sortOrder.
- Jika tidak ada kartu tersisa, tampilkan end-of-deck state.

#### Internal Metadata

```txt
phase:
- opening
- warm
- core
- reflection

sensitivity:
- low
- medium
- high

topic:
- intro
- values
- finance
- family
- conflict
- future
- appreciation
- distance
- commitment
```

#### Acceptance Criteria

- Kartu tidak berulang dalam satu sesi.
- Kartu sesuai dengan deck yang dipilih.
- User tidak melihat metadata internal.
- Sistem tetap berjalan walau user refresh page.

---

### 14.4 Next Card

#### Description

User melanjutkan ke kartu berikutnya.

#### Functional Requirements

- Current card dicatat sebagai viewed.
- Sistem mengambil next card.
- Progress bertambah.
- UI melakukan transisi kartu.

#### Acceptance Criteria

- Kartu berubah setelah klik next.
- Viewed card ID tersimpan.
- Progress update.
- Kartu sebelumnya tidak muncul lagi dalam sesi aktif.

---

### 14.5 Skip Card

#### Description

User bisa melewati kartu.

#### Functional Requirements

- Current card dicatat sebagai skipped.
- Sistem mengambil kartu berikutnya.
- Tidak ada penalti visual.
- Copy harus terasa aman.

#### Suggested Copy

```txt
Lewati dulu
```

```txt
Belum siap jawab
```

#### Acceptance Criteria

- User bisa skip kartu.
- Skipped card ID tersimpan.
- Kartu baru tampil.
- Skip tidak ditampilkan sebagai failure.

---

### 14.6 Favorite Card

#### Description

User bisa menyimpan kartu penting.

#### Functional Requirements

- User klik favorite.
- Card ID disimpan ke favorite list.
- Icon berubah menjadi active.
- User bisa unfavorite.
- Favorite card tampil di `/favorites`.

#### Acceptance Criteria

- Favorite tersimpan setelah refresh.
- Favorite bisa dihapus.
- Favorite tidak duplikat.
- Icon active sesuai state.

---

### 14.7 Session Summary

#### Description

User melihat ringkasan setelah sesi selesai.

#### Functional Requirements

- Hitung jumlah kartu dibuka.
- Hitung jumlah kartu favorit.
- Tampilkan deck yang dimainkan.
- Tampilkan CTA lanjutan.

#### Acceptance Criteria

- Summary muncul setelah end session.
- Tidak ada skor hubungan.
- User bisa kembali ke home.
- User bisa lihat favorites.
- User bisa main lagi.

---

### 14.8 Play Together Mode

#### Description

Play Together Mode adalah mode multiplayer turn-based yang memungkinkan beberapa pemain masuk ke room yang sama, memilih kartu secara bergiliran, dan melihat kartu yang sudah dibuka bersama-sama.

#### Goal

Allow multiple players to choose and reveal cards in turn-based sessions.

#### Functional Requirements

- Host bisa membuat multiplayer room dari deck.
- Room memiliki code atau link yang bisa dibagikan.
- Pemain lain bisa join room menggunakan code atau link.
- Sistem menampilkan daftar pemain dalam room.
- Sistem menentukan current-turn player.
- Hanya current-turn player yang bisa membuka kartu dalam turn-based mode.
- Kartu yang sudah dibuka tetap terlihat untuk semua pemain.
- Room state tetap tersimpan setelah refresh.
- Host bisa mengakhiri session.

#### Acceptance Criteria

- Room bisa dibuat dari deck aktif.
- Join code/link membawa pemain ke room yang benar.
- Reveal action ditolak jika bukan giliran pemain tersebut.
- Semua pemain melihat kartu yang sudah revealed.
- Refresh browser tidak menghapus state room.
- End session oleh host mengubah room menjadi ended dan mencegah reveal baru.

#### Product Notes

- Phase awal dapat menggunakan polling sebelum realtime/WebSocket.
- Mode ini tidak menggantikan solo play flow.
- `/play/[sessionId]` tetap dipakai untuk solo linear session.
- Table Mode menjadi fondasi UX untuk Play Together Mode.

---

## 15. Data Model

### 15.1 Deck

```ts
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

### 15.2 Card

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

### 15.3 Session

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

### 15.4 Onboarding Preference

```ts
type OnboardingPreference = {
  relationshipType: "partner" | "pdkt" | "friend" | "family" | "self";
  relationshipStage?: "new" | "dating" | "ldr" | "engaged" | "married";
  preferredTone?: "casual" | "honest" | "fun" | "serious";
};
```

---

## 16. Content Requirements

### 16.1 Initial Decks

MVP awal menggunakan 4–5 deck:

- Ice Breaker
- PDKT
- Pacaran
- LDR
- Pra-Nikah

### 16.2 Minimum Card Count

Untuk MVP:

| Deck | Minimum Cards |
|---|---:|
| Ice Breaker | 30 |
| PDKT | 30 |
| Pacaran | 30 |
| LDR | 30 |
| Pra-Nikah | 30 |

Total minimum: 150 kartu.

### 16.3 Content Rules

- Pertanyaan harus original.
- Tidak menyalin dari produk kartu fisik yang sudah ada.
- Tidak menggunakan parafrase ringan dari brand lain.
- Pertanyaan harus ditulis dengan bahasa Indonesia natural.
- Pertanyaan tidak boleh terlalu panjang.
- Pertanyaan harus sesuai konteks deck.
- Pertanyaan sensitif harus diberi metadata sensitivity.

### 16.4 Content Tone

Gunakan bahasa yang:

- Natural.
- Hangat.
- Direct.
- Playful.
- Tidak menggurui.
- Tidak terlalu klinis.
- Tidak judgmental.

Hindari bahasa:

- “Wajib jawab.”
- “Tes hubungan kalian.”
- “Nilai pasanganmu.”
- “Jawabanmu salah.”
- “Skor kecocokan.”

---

## 17. Analytics Requirements

MVP sebaiknya melacak event dasar.

### 17.1 Events

| Event | Description |
|---|---|
| landing_viewed | User membuka landing page |
| onboarding_started | User mulai onboarding |
| onboarding_completed | User selesai onboarding |
| deck_viewed | User membuka deck detail |
| session_started | User mulai sesi |
| card_viewed | Card tampil |
| card_skipped | User skip card |
| card_favorited | User favorite card |
| session_completed | User menyelesaikan sesi |
| favorites_viewed | User membuka favorites |
| share_clicked | User klik share |

### 17.2 MVP Metrics

| Metric | Goal |
|---|---|
| Landing to onboarding conversion | Menilai ketertarikan awal |
| Onboarding completion rate | Menilai friction onboarding |
| Deck start rate | Menilai minat deck |
| Average cards per session | Menilai engagement |
| Favorite rate | Menilai kualitas kartu |
| Skip rate | Menilai sensitivitas/kecocokan kartu |
| Session completion rate | Menilai kualitas flow |
| Share click rate | Menilai potensi growth |

---

## 18. Technical Requirements

### 18.1 Recommended Stack

```txt
Next.js
TypeScript
Tailwind CSS
Framer Motion
Zustand
LocalStorage / IndexedDB
PWA support
```

### 18.2 Frontend Requirements

- Mobile-first.
- Responsive.
- Works on modern mobile browsers.
- PWA-ready.
- Fast initial load.
- Local storage support.
- Smooth card transition.
- Accessible button size.
- Works without login.

### 18.3 Storage

For MVP:

- localStorage for simple preferences.
- IndexedDB optional for more structured offline data.

Data stored locally:

- anonymousUserId.
- onboardingPreference.
- activeSession.
- favoriteCards.
- viewedCards.
- skippedCards.

---

## 19. Performance Requirements

- Landing page should load fast on mobile connection.
- Card transition should feel instant.
- Card data should be preloaded per deck.
- Avoid heavy animation on play screen.
- Avoid large image assets in MVP.
- Optimize share templates if implemented.

---

## 20. Accessibility Requirements

- Minimum body text size: 16px.
- Question text should be large and readable.
- Touch target minimum: 44px x 44px.
- Strong contrast between text and background.
- Buttons must be keyboard accessible.
- Avoid relying only on color to communicate state.
- Provide clear labels for icon buttons.
- Motion should be subtle.

---

## 21. Privacy Requirements

MVP should not store private answers.

Do not store:

- User answers.
- Chat content.
- Personal relationship notes.
- Sensitive confession text.

Allowed to store:

- Favorite card IDs.
- Viewed card IDs.
- Skipped card IDs.
- Deck preference.
- Session progress.

If later adding notes or couple mode, privacy requirements must be reviewed again.

---

## 22. Monetization Plan

Monetization is not required for MVP, but product should be structured to support it later.

### 22.1 Potential Monetization

- Premium deck.
- One-time purchase per deck.
- Bundle deck.
- Lifetime access.
- Subscription, if needed later.

### 22.2 Premium Deck Examples

- Pra-Nikah Deep.
- Konflik & Ekspektasi.
- Suami-Istri.
- Keuangan & Masa Depan.
- LDR Deep.
- Healing Masa Lalu.

---

## 23. Milestones

### Milestone 1 — Prototype

Goal: validate main experience.

Scope:

- Landing.
- Deck list.
- Deck detail.
- Play card.
- Next.
- Skip.
- Favorite.
- Summary.
- Local data.

### Milestone 2 — MVP Public Test

Goal: release to small audience.

Scope:

- Onboarding.
- Home.
- Recommended deck.
- Favorites page.
- No-repeat logic.
- Basic analytics.
- PWA-ready.

### Milestone 3 — Growth Features

Goal: improve sharing and retention.

Scope:

- Share card.
- Wildcard.
- Continue session.
- Pause bottom sheet.
- Better deck filtering.

### Milestone 4 — Monetization

Goal: test revenue.

Scope:

- Premium deck.
- Paywall.
- Payment.
- Unlock deck logic.

### Milestone 5 — Content System

Goal: scale card content.

Scope:

- Admin content panel.
- Content tagging.
- Publish/unpublish.
- Deck management.
- Card management.

---

## 24. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| User merasa pertanyaan terlalu berat | User churn | Sediakan skip, phase internal, dan deck context jelas |
| User malas login | Drop-off tinggi | Gunakan guest mode |
| UI terlalu ramai | Play experience terganggu | Play screen hanya satu kartu |
| Konten terasa generik | Engagement rendah | Buat pertanyaan original dan relevan |
| Pertanyaan mirip produk lain | Risiko HKI | Buat semua konten dari nol |
| Monetisasi terlalu cepat | User belum percaya | Validasi free deck dulu |
| Produk terasa seperti kuis hubungan | Salah positioning | Hindari skor, ranking, dan tes kecocokan |

---

## 25. Open Questions

- Apa nama final produk?
- Deck mana yang akan dijadikan deck gratis utama?
- Apakah Pra-Nikah masuk MVP gratis atau premium?
- Apakah share card masuk MVP atau P1?
- Apakah onboarding wajib atau bisa dilewati?
- Apakah perlu mode “langsung main” dari landing page?
- Berapa jumlah kartu ideal per deck untuk MVP?
- Apakah desain akan mobile-only dulu atau juga desktop responsive?
- Apakah data awal cukup di local file atau langsung pakai database?
- Apakah akan menggunakan analytics sejak MVP pertama?

---

## 26. MVP Success Criteria

MVP dianggap berhasil jika:

- User bisa memahami produk dari landing page.
- User bisa mulai bermain tanpa login.
- User bisa memilih deck.
- User bisa menyelesaikan satu sesi kartu.
- User menggunakan fitur favorite.
- User tidak bingung dengan alur tanpa level selection.
- User merasa pengalaman digital ini cukup dekat dengan pengalaman kartu fisik.
- User bersedia membagikan kartu atau mengajak orang lain mencoba.

---

## 27. Final Summary

Produk ini adalah web/PWA kartu obrolan digital yang mengutamakan akses cepat, pengalaman bermain sederhana, dan visual yang bold serta mudah dibagikan.

Core experience:

```txt
Choose Deck → Play Card → Next / Skip / Favorite → Summary
```

Fokus MVP:

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

Hal yang sengaja tidak dibuat di MVP:

```txt
Level Selection
Relationship Score
Chat
Social Feed
AI Therapist
Leaderboard
Daily Quiz
```

Product focus:

```txt
Kartu obrolan digital yang cepat dibuka, mudah dimainkan, berani secara visual, dan enak dibagikan.
```
