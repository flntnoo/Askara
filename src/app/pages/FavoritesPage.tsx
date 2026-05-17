'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { getCardById } from '../../data/cards';
import { getDeckById } from '../../data/decks';
import { ConversationCard } from '../../types';
import { useFavoriteStore } from '../../stores/favoriteStore';

export default function FavoritesPage() {
  const favoriteCardIds = useFavoriteStore((state) => state.favorites);
  const loadFavorites = useFavoriteStore((state) => state.getFavorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const [selectedDeck, setSelectedDeck] = useState<string>('all');

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favoriteCards = favoriteCardIds
    .map((id) => getCardById(id))
    .filter((card): card is ConversationCard => card !== undefined);

  // Get unique decks
  const decks = Array.from(new Set(favoriteCards.map((card) => card.deckId)));

  // Filter cards by deck
  const filteredCards =
    selectedDeck === 'all'
      ? favoriteCards
      : favoriteCards.filter((card) => card.deckId === selectedDeck);

  const handleRemoveFavorite = (cardId: string) => {
    removeFavorite(cardId);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="max-w-[1152px] mx-auto w-full px-4 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-2 tracking-[-0.96px]">
            Kartu Favorit
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c]">
            Semua pertanyaan yang kamu simpan untuk dibahas lagi nanti.
          </p>
        </div>

        {favoriteCards.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="bg-[#f0edec] border-2 border-[#1c1b1b] rounded-full p-8 mb-6">
              <Heart className="w-16 h-16 text-[#58413c]" />
            </div>
            <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-2">
              Belum ada kartu yang disimpan
            </h2>
            <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] text-center max-w-md">
              Simpan pertanyaan yang ingin kamu bahas lagi nanti saat bermain kartu.
            </p>
          </div>
        ) : (
          <>
            {/* Filter */}
            {decks.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedDeck('all')}
                  className={`min-h-11 px-4 py-2 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold whitespace-nowrap transition-all ${
                    selectedDeck === 'all'
                      ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                      : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
                  }`}
                >
                  Semua ({favoriteCards.length})
                </button>
                {decks.map((deckId) => {
                  const deck = getDeckById(deckId);
                  const count = favoriteCards.filter(
                    (card) => card.deckId === deckId
                  ).length;
                  return (
                    <button
                      key={deckId}
                      onClick={() => setSelectedDeck(deckId)}
                      className={`min-h-11 px-4 py-2 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold whitespace-nowrap transition-all ${
                        selectedDeck === deckId
                          ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                          : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
                      }`}
                    >
                      {deck?.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredCards.map((card) => {
                const deck = getDeckById(card.deckId);
                return (
                  <div
                    key={card.id}
                    className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] relative group"
                  >
                    {/* Deck Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-[#1c1b1b] mb-4 text-sm"
                      style={{ backgroundColor: deck?.color }}
                    >
                      <span>{deck?.icon}</span>
                      <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b]">
                        {deck?.name}
                      </span>
                    </div>

                    {/* Question */}
                    <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#1c1b1b] mb-4">
                      "{card.content}"
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFavorite(card.id)}
                      aria-label="remove favorite"
                      className="min-h-11 flex items-center gap-2 text-[#58413c] hover:text-[#a93718] transition-colors font-['Hanken_Grotesk',sans-serif] font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
