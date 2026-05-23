'use client';

import { getAllDecks } from '../../data/decks';
import DeckCard from '../components/DeckCard';

export default function DecksPage() {
  const allDecks = getAllDecks();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="max-w-[1152px] mx-auto w-full px-4 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-2 tracking-[-0.96px]">
            Semua Deck
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c]">
            Pilih deck yang sesuai dengan konteks dan kedalaman obrolan yang kamu inginkan.
          </p>
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      </div>
    </div>
  );
}
