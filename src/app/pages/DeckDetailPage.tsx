'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, UsersRound } from 'lucide-react';
import { getDeckBySlug } from '../../data/decks';
import { getCardsByDeckId } from '../../data/cards';
import { useSessionStore } from '../../stores/sessionStore';

export default function DeckDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const createSession = useSessionStore((state) => state.createSession);

  const deck = slug ? getDeckBySlug(slug) : undefined;
  const cards = deck ? getCardsByDeckId(deck.id) : [];

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-4">
          Deck tidak ditemukan
        </h1>
        <Link
          href="/decks"
          className="text-[#a93718] font-['Hanken_Grotesk',sans-serif] font-bold hover:underline"
        >
          Kembali ke Semua Deck
        </Link>
      </div>
    );
  }

  const handleStartDeck = async () => {
    const session = await createSession(deck.id);
    router.push(`/play/${session.id}`);
  };

  const handleStartMultiplayer = () => {
    router.push(`/multiplayer/${deck.slug}`);
  };

  // Get first 3 cards as preview
  const previewCards = cards.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="max-w-[1152px] mx-auto w-full px-4 md:px-8 py-6 md:py-12">
        {/* Back Button */}
        <Link
          href="/decks"
          className="inline-flex items-center gap-2 text-[#58413c] hover:text-[#a93718] transition-colors mb-8 font-['Hanken_Grotesk',sans-serif] font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Semua Deck
        </Link>

        {/* Deck Header */}
        <div className="mb-12">
          <div
            className="w-full max-w-md h-48 md:h-64 rounded-2xl mb-6 flex items-center justify-center border-4 border-[#1c1b1b] shadow-[8px_8px_0px_#1c1b1b] text-6xl md:text-8xl"
            style={{ backgroundColor: deck.color }}
          >
            {deck.icon}
          </div>

          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[40px] md:text-[56px] text-[#1c1b1b] mb-4 tracking-[-1.12px]">
            {deck.name}
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[18px] md:text-[20px] text-[#58413c] mb-6 max-w-2xl">
            {deck.description}
          </p>

          {/* Deck Meta */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white border-2 border-[#1c1b1b] rounded-lg px-4 py-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b]">
              {deck.cardCount} kartu
            </div>
            <div className="bg-white border-2 border-[#1c1b1b] rounded-lg px-4 py-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b]">
              {deck.estimatedDuration ?? `${deck.estimatedMinutes} menit`}
            </div>
          </div>

          {/* Start Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartDeck}
              className="bg-[#ff7551] drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-xl px-8 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] text-lg hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" fill="#6b1500" />
              Mulai Deck Ini
            </button>
            <button
              onClick={handleStartMultiplayer}
              className="bg-white drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-xl px-8 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] text-lg hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-3"
            >
              <UsersRound className="w-5 h-5" />
              Play Multiplayer
            </button>
          </div>
        </div>

        {/* Suitable For */}
        <div className="mb-12">
          <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] text-[#1c1b1b] mb-4">
            Cocok untuk:
          </h2>
          <div className="flex flex-wrap gap-2">
            {(deck.suitableFor ?? []).map((item, index) => (
              <span
                key={index}
                className="bg-[#f0edec] border-2 border-[#1c1b1b] rounded-lg px-4 py-2 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-12">
          <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] text-[#1c1b1b] mb-4">
            Topik yang dibahas:
          </h2>
          <div className="flex flex-wrap gap-2">
            {(deck.topics ?? []).map((topic, index) => (
              <span
                key={index}
                className="bg-white border-2 border-[#1c1b1b] rounded-lg px-4 py-2 font-['Hanken_Grotesk',sans-serif] font-medium text-[#1c1b1b]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Preview Cards */}
        <div className="mb-12">
          <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] text-[#1c1b1b] mb-4">
            Contoh Pertanyaan:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewCards.map((card) => (
              <div
                key={card.id}
                className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b]"
              >
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#1c1b1b] text-base">
                  "{card.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartDeck}
              className="bg-[#ff7551] drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-xl px-8 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] text-lg hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all inline-flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" fill="#6b1500" />
              Mulai Deck Ini
            </button>
            <button
              onClick={handleStartMultiplayer}
              className="bg-white drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-xl px-8 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] text-lg hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all inline-flex items-center justify-center gap-3"
            >
              <UsersRound className="w-5 h-5" />
              Play Multiplayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
