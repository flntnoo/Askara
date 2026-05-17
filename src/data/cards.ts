import { CardPhase, CardSensitivity, CardTopic, ConversationCard } from '../types';

type CardBlueprint = {
  deckId: string;
  prefix: string;
  topic: CardTopic;
  sensitivity: CardSensitivity;
  questions: string[];
};

const PHASE_BY_INDEX: CardPhase[] = [
  'opening',
  'opening',
  'opening',
  'opening',
  'opening',
  'opening',
  'warm',
  'warm',
  'warm',
  'warm',
  'warm',
  'warm',
  'warm',
  'warm',
  'core',
  'core',
  'core',
  'core',
  'core',
  'core',
  'core',
  'core',
  'reflection',
  'reflection',
  'reflection',
  'reflection',
  'reflection',
  'reflection',
  'reflection',
  'reflection',
];

const BLUEPRINTS: CardBlueprint[] = [
  {
    deckId: 'deck-ice-breaker',
    prefix: 'ib',
    topic: 'intro',
    sensitivity: 'low',
    questions: [
      'Kalau bisa punya satu superpower, kamu pilih apa dan kenapa?',
      'Makanan apa yang bisa kamu makan setiap hari tanpa bosan?',
      'Film atau series apa yang menurutmu wajib ditonton?',
      'Kalau weekend besok tiba-tiba kosong, kamu mau ngapain?',
      'Cerita pengalaman paling kocak yang pernah kamu alami.',
      'Kalau bisa jalan-jalan tanpa batas biaya, kamu mau ke mana?',
      'Hobi apa yang pengen kamu coba tapi belum sempat?',
      'Lagu apa yang selalu bikin kamu semangat?',
      'Hal kecil apa yang bisa langsung memperbaiki mood kamu?',
      'Kalau hidupmu punya judul episode hari ini, judulnya apa?',
    ],
  },
  {
    deckId: 'deck-pdkt',
    prefix: 'pdkt',
    topic: 'values',
    sensitivity: 'medium',
    questions: [
      'Hal apa yang paling kamu hargai dalam sebuah hubungan?',
      'Menurutmu, apa yang bikin kamu tertarik sama seseorang?',
      'Apa yang bikin kamu merasa nyaman sama orang baru?',
      'Gimana cara kamu nunjukin perhatian ke orang yang kamu suka?',
      'Hal apa yang menurutmu red flag dari awal?',
      'Obrolan seperti apa yang bikin kamu betah lama-lama?',
      'Apa ekspektasi kecil yang kamu punya saat mulai dekat?',
      'Kamu lebih suka ditemani, didengar, atau diajak bercanda?',
      'Apa kebiasaanmu yang biasanya baru kelihatan setelah dekat?',
      'Apa hal yang ingin kamu tahu sebelum hubungan jadi serius?',
    ],
  },
  {
    deckId: 'deck-pacaran',
    prefix: 'pc',
    topic: 'commitment',
    sensitivity: 'medium',
    questions: [
      'Apa yang paling kamu suka dari hubungan kita sejauh ini?',
      'Menurutmu, gimana cara kita berkomunikasi selama ini?',
      'Hal apa yang perlu kita perbaiki dalam hubungan ini?',
      'Apa ekspektasi kamu tentang hubungan kita beberapa tahun ke depan?',
      'Kapan terakhir kali kamu merasa benar-benar didengarkan?',
      'Apa love language kamu yang paling terasa?',
      'Hal apa dari aku yang bikin kamu paling nyaman?',
      'Kebiasaan kecil apa yang ingin kita bangun bersama?',
      'Apa bentuk dukungan yang paling kamu butuhkan dariku?',
      'Apa batasan sehat yang perlu kita jaga?',
    ],
  },
  {
    deckId: 'deck-ldr',
    prefix: 'ldr',
    topic: 'distance',
    sensitivity: 'medium',
    questions: [
      'Apa yang paling kamu kangen saat kita berjauhan?',
      'Gimana cara kamu menghadapi rasa kangen yang datang tiba-tiba?',
      'Hal apa yang bikin kamu khawatir soal hubungan jarak jauh kita?',
      'Rencana ketemu seperti apa yang paling kamu tunggu?',
      'Apa yang bikin kamu yakin hubungan ini bisa tetap kuat?',
      'Bagaimana cara kita menjaga rutinitas komunikasi tanpa terasa wajib?',
      'Apa hal kecil dari jauh yang bikin kamu merasa disayang?',
      'Kapan jarak terasa paling berat buat kamu?',
      'Apa yang perlu kita sepakati supaya sama-sama tenang?',
      'Apa momen LDR yang paling ingin kamu rayakan?',
    ],
  },
  {
    deckId: 'deck-pra-nikah',
    prefix: 'pn',
    topic: 'finance',
    sensitivity: 'high',
    questions: [
      'Hal finansial apa yang paling perlu kita sepakati dari awal?',
      'Gimana pembagian tanggung jawab rumah tangga yang ideal menurutmu?',
      'Apa ekspektasi kamu soal hubungan kita dengan keluarga besar?',
      'Kapan menurutmu waktu yang tepat untuk punya anak?',
      'Kalau ada konflik besar, gimana cara kita menghadapinya?',
      'Di mana kamu ingin kita tinggal setelah menikah?',
      'Apa yang paling kamu takutkan tentang menikah?',
      'Bagaimana kita mengatur uang kalau pendapat kita beda?',
      'Peran apa yang kamu harapkan dariku di rumah tangga?',
      'Nilai keluarga apa yang wajib kita bawa ke pernikahan?',
    ],
  },
  {
    deckId: 'deck-suami-istri',
    prefix: 'si',
    topic: 'intimacy',
    sensitivity: 'medium',
    questions: [
      'Apa yang paling kamu syukuri dari pernikahan kita?',
      'Gimana kita bisa lebih baik membagi tanggung jawab rumah?',
      'Apa yang bisa aku lakukan supaya kamu merasa lebih dihargai?',
      'Hal apa yang perlu kita tingkatkan dalam keintiman kita?',
      'Bagaimana cara kita tetap romantis di tengah kesibukan?',
      'Rutinitas kecil apa yang ingin kita bangun bersama?',
      'Gimana kita bisa lebih kompak sebagai tim?',
      'Apa ekspektasi kamu tentang peran kita masing-masing di rumah?',
      'Kapan kamu merasa kita paling dekat akhir-akhir ini?',
      'Apa bentuk istirahat bersama yang paling kamu butuhkan?',
    ],
  },
  {
    deckId: 'deck-konflik',
    prefix: 'kf',
    topic: 'conflict',
    sensitivity: 'high',
    questions: [
      'Gimana cara terbaik menyampaikan kalau aku lagi kesal?',
      'Hal apa yang bikin kamu paling tersinggung saat bertengkar?',
      'Apa yang kamu butuhkan saat kamu lagi sedih atau marah?',
      'Apakah ada luka lama yang masih perlu kita bicarakan?',
      'Gimana cara kamu ingin aku minta maaf kalau aku salah?',
      'Apa yang bisa kita lakukan agar konflik yang sama tidak berulang?',
      'Kapan terakhir kali kamu merasa perasaanmu tidak didengar?',
      'Apa batasan yang kamu punya saat kita sedang bertengkar?',
      'Apa tanda bahwa kita perlu jeda sebelum lanjut bicara?',
      'Kalimat apa yang paling membantumu merasa aman?',
    ],
  },
  {
    deckId: 'deck-apresiasi',
    prefix: 'ap',
    topic: 'appreciation',
    sensitivity: 'low',
    questions: [
      'Sebutkan satu hal kecil dariku yang bikin kamu senang.',
      'Apa yang paling kamu suka dari caraku memperlakukan kamu?',
      'Kapan terakhir kali kamu merasa bangga sama aku?',
      'Hal apa dariku yang menurutmu paling berharga?',
      'Ceritakan satu momen saat kamu merasa sangat dicintai.',
      'Apa yang paling kamu syukuri dari hubungan kita?',
      'Hal apa yang ingin kamu ucapkan terima kasih tapi belum sempat?',
      'Kebaikan kecil apa yang paling kamu ingat?',
      'Apa kualitasku yang sering kamu lupakan untuk apresiasi?',
      'Bagaimana aku bisa lebih sering membuatmu merasa dilihat?',
    ],
  },
  {
    deckId: 'deck-masa-depan',
    prefix: 'md',
    topic: 'future',
    sensitivity: 'medium',
    questions: [
      'Di mana kamu ingin kita tinggal lima tahun dari sekarang?',
      'Apa prioritas karier kamu dalam beberapa tahun ke depan?',
      'Kapan menurutmu waktu yang tepat untuk punya anak?',
      'Apa impian terbesar yang ingin kita wujudkan bersama?',
      'Gimana kita menyeimbangkan karier dan keluarga nanti?',
      'Apa yang penting untuk kita capai dalam sepuluh tahun?',
      'Bagaimana kita memastikan rencana hidup kita tetap sejalan?',
      'Apa yang ingin kamu ubah dari gaya hidup kita saat ini?',
      'Keputusan besar apa yang perlu kita mulai diskusikan?',
      'Apa definisi hidup cukup menurut kamu?',
    ],
  },
];

const buildDeckCards = (blueprint: CardBlueprint): ConversationCard[] =>
  Array.from({ length: 30 }, (_, index) => {
    const sortOrder = index + 1;
    const baseContent = blueprint.questions[index % blueprint.questions.length];
    const cycle = Math.floor(index / blueprint.questions.length);
    const suffix = cycle === 0 ? '' : ` (variasi ${cycle + 1})`;

    return {
      id: `${blueprint.prefix}-${sortOrder}`,
      deckId: blueprint.deckId,
      type: 'question',
      topic: blueprint.topic,
      sensitivity: blueprint.sensitivity,
      phase: PHASE_BY_INDEX[index],
      content: `${baseContent}${suffix}`,
      isPremium: false,
      isActive: true,
      sortOrder,
    };
  });

export const CARDS: ConversationCard[] = BLUEPRINTS.flatMap(buildDeckCards);

export const getCardsByDeckId = (deckId: string): ConversationCard[] => {
  return CARDS.filter((card) => card.deckId === deckId);
};

export const getCardById = (cardId: string): ConversationCard | undefined => {
  return CARDS.find((card) => card.id === cardId);
};
