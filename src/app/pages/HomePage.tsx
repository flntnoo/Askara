'use client';

import Link from 'next/link';
import { Play, Heart, Sparkles } from 'lucide-react';
import { getActiveSession, getFavorites, getOnboardingPreference } from '../../utils/storage';
import { getAllDecks } from '../../data/decks';
import { useEffect, useState } from 'react';
import { CardSession } from '../../types';
import { getRecommendedDecks } from '../../utils/recommendationEngine';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import DeckCard from '../components/DeckCard';

export default function HomePage() {
  const [activeSession, setActiveSession] = useState<CardSession | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [onboarding, setOnboarding] = useState(getOnboardingPreference());
  const hydrateFavorites = useFavoriteStore((state) => state.hydrateFavorites);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrateOnboarding);
  const allDecks = getAllDecks();

  useEffect(() => {
    setActiveSession(getActiveSession());
    setFavoriteCount(getFavorites().length);
    setOnboarding(getOnboardingPreference());
    void hydrateFavorites().then((favorites) => setFavoriteCount(favorites.length));
    void hydrateOnboarding().then((preference) => setOnboarding(preference));
  }, [hydrateFavorites, hydrateOnboarding]);

  const recommendedDecks = getRecommendedDecks(allDecks, onboarding);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="max-w-[1152px] mx-auto w-full px-4 md:px-8 py-6 md:py-12">
        {/* Greeting */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-2 tracking-[-0.96px]">
            Mau ngobrolin apa hari ini?
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c]">
            Pilih deck yang sesuai dengan suasana hati kamu.
          </p>
        </div>

        {/* Continue Session */}
        {activeSession && (
          <Link
            href={`/play/${activeSession.id}`}
            className="block bg-[#ffe087] border-2 border-[#1c1b1b] rounded-xl p-6 mb-8 shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#ff7551] p-3 rounded-lg border-2 border-[#1c1b1b]">
                <Play className="w-6 h-6 text-[#6b1500]" fill="#6b1500" />
              </div>
              <div className="flex-1">
                <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-1">
                  Lanjutkan Sesi
                </h3>
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                  {activeSession.viewedCardIds.length} kartu sudah dibuka
                </p>
              </div>
              <div className="text-[#a93718]">&rarr;</div>
            </div>
          </Link>
        )}

        {/* Favorites Shortcut */}
        {favoriteCount > 0 && (
          <Link
            href="/favorites"
            className="block bg-white border-2 border-[#1c1b1b] rounded-xl p-6 mb-8 shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#ffe087] p-3 rounded-lg border-2 border-[#1c1b1b]">
                <Heart className="w-6 h-6 text-[#a93718]" fill="#a93718" />
              </div>
              <div className="flex-1">
                <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-1">
                  Kartu Favorit
                </h3>
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                  {favoriteCount} kartu tersimpan
                </p>
              </div>
              <div className="text-[#a93718]">&rarr;</div>
            </div>
          </Link>
        )}

        {/* Recommended Decks */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#a93718]" />
            <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] md:text-[32px] text-[#1c1b1b]">
              Rekomendasi Untukmu
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recommendedDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>

        {/* All Decks Link */}
        <div className="text-center">
          <Link
            href="/decks"
            className="inline-flex items-center gap-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#a93718] hover:underline"
          >
            Lihat Semua Deck
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
