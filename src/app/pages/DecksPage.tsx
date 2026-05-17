'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getAllDecks } from '../../data/decks';
import { DeckCategory } from '../../types';

const FILTERS: Array<{ label: string; category: DeckCategory | 'all' }> = [
  { label: 'Semua', category: 'all' },
  { label: 'PDKT', category: 'pdkt' },
  { label: 'Pasangan', category: 'pacaran' },
  { label: 'LDR', category: 'ldr' },
  { label: 'Pra-Nikah', category: 'pra-nikah' },
  { label: 'Apresiasi', category: 'apresiasi' },
  { label: 'Konflik', category: 'konflik' },
  { label: 'Masa Depan', category: 'masa-depan' },
];

export default function DecksPage() {
  const [selectedCategory, setSelectedCategory] = useState<DeckCategory | 'all'>('all');
  const allDecks = getAllDecks();
  const visibleDecks =
    selectedCategory === 'all'
      ? allDecks
      : allDecks.filter((deck) => deck.category === selectedCategory);

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

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.category}
              type="button"
              aria-pressed={selectedCategory === filter.category}
              onClick={() => setSelectedCategory(filter.category)}
              className={`min-h-11 px-4 py-2 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold whitespace-nowrap transition-all ${
                selectedCategory === filter.category
                  ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                  : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {visibleDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/decks/${deck.slug}`}
              className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
            >
              {/* Deck Color Preview */}
              <div
                className="w-full h-40 rounded-lg mb-4 flex items-center justify-center border-2 border-[#1c1b1b] text-5xl"
                style={{ backgroundColor: deck.color }}
              >
                {deck.icon}
              </div>

              {/* Deck Info */}
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-xl text-[#1c1b1b] mb-2">
                {deck.name}
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-normal text-sm text-[#58413c] mb-4 line-clamp-2">
                {deck.description}
              </p>

              {/* Deck Meta */}
              <div className="flex items-center gap-2 text-xs text-[#58413c] font-['Hanken_Grotesk',sans-serif] font-medium">
                <span>{deck.cardCount} kartu</span>
                <span>•</span>
                <span>{deck.estimatedDuration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
