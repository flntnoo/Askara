'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Home, Layers, Play } from 'lucide-react';
import { getSession } from '../../utils/storage';
import { getDeckById } from '../../data/decks';
import { useEffect, useState } from 'react';
import { CardSession } from '../../types';

export default function SummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<CardSession | null | undefined>(undefined);
  const deck = session ? getDeckById(session.deckId) : undefined;

  useEffect(() => {
    setSession(sessionId ? getSession(sessionId) : null);
  }, [sessionId]);

  useEffect(() => {
    if (session === null) {
      router.push('/home');
    }
  }, [session, router]);

  if (!session || !deck) {
    return null;
  }

  const cardsOpened = session.viewedCardIds.length;
  const cardsSkipped = session.skippedCardIds.length;
  const cardsSaved = session.favoriteCardIds.length;

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Completion Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#ffe087] border-4 border-[#1c1b1b] rounded-full shadow-[8px_8px_0px_#1c1b1b] mb-6">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-4 tracking-[-0.96px]">
            Sesi Selesai!
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[18px] md:text-[20px] text-[#58413c] mb-8">
            Kalian baru saja membuka {cardsOpened} obrolan dari deck{' '}
            <span className="font-bold text-[#a93718]">{deck.name}</span>.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 text-center shadow-[4px_4px_0px_#1c1b1b]">
            <div className="text-4xl font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718] mb-2">
              {cardsOpened}
            </div>
            <div className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
              Kartu Dibuka
            </div>
          </div>
          <div className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 text-center shadow-[4px_4px_0px_#1c1b1b]">
            <div className="text-4xl font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718] mb-2">
              {cardsSkipped}
            </div>
            <div className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
              Kartu Dilewati
            </div>
          </div>
          <div className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 text-center shadow-[4px_4px_0px_#1c1b1b]">
            <div className="text-4xl font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718] mb-2">
              {cardsSaved}
            </div>
            <div className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
              Kartu Disimpan
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* View Favorites */}
          {cardsSaved > 0 && (
            <Link
              href="/favorites"
              className="flex items-center gap-4 p-6 bg-[#ffe087] border-2 border-[#1c1b1b] rounded-xl shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
            >
              <div className="bg-white p-3 rounded-lg border-2 border-[#1c1b1b]">
                <Heart className="w-6 h-6 text-[#a93718]" fill="#a93718" />
              </div>
              <div className="flex-1">
                <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-1">
                  Lihat Kartu Favorit
                </h3>
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                  Buka kembali {cardsSaved} kartu yang kamu simpan
                </p>
              </div>
            </Link>
          )}

          {/* Play Again */}
          <Link
            href={`/decks/${deck.slug}`}
            className="flex items-center gap-4 p-6 bg-[#ff7551] border-2 border-[#1c1b1b] rounded-xl shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
          >
            <div className="bg-white p-3 rounded-lg border-2 border-[#1c1b1b]">
              <Play className="w-6 h-6 text-[#a93718]" fill="#a93718" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#6b1500] mb-1">
                Main Lagi
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#6b1500] opacity-80">
                Mulai sesi baru dengan deck {deck.name}
              </p>
            </div>
          </Link>

          {/* Explore Decks */}
          <Link
            href="/decks"
            className="flex items-center gap-4 p-6 bg-white border-2 border-[#1c1b1b] rounded-xl shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
          >
            <div className="bg-[#f0edec] p-3 rounded-lg border-2 border-[#1c1b1b]">
              <Layers className="w-6 h-6 text-[#58413c]" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-1">
                Coba Deck Lain
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                Eksplorasi deck dengan tema berbeda
              </p>
            </div>
          </Link>

          {/* Back to Home */}
          <Link
            href="/home"
            className="flex items-center gap-4 p-6 bg-white border-2 border-[#1c1b1b] rounded-xl shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
          >
            <div className="bg-[#f0edec] p-3 rounded-lg border-2 border-[#1c1b1b]">
              <Home className="w-6 h-6 text-[#58413c]" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-1">
                Kembali ke Home
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                Lihat rekomendasi deck untukmu
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
