'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Deck } from '../../types';
import { getDeckListingCoverSrc } from '../../data/deckListingCovers';

type DeckCardProps = {
    deck: Deck;
};

export default function DeckCard({ deck }: DeckCardProps) {
    const coverSrc = getDeckListingCoverSrc(deck.slug);

    return (
        <Link
            href={`/decks/${deck.slug}`}
            className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
        >
            <div className="relative w-full h-40 rounded-lg mb-4 overflow-hidden border-2 border-[#1c1b1b]">
                <Image
                    src={coverSrc}
                    alt={`${deck.name} cover`}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-xl text-[#1c1b1b] mb-2">
                {deck.name}
            </h3>
            <p className="font-['Hanken_Grotesk',sans-serif] font-normal text-sm text-[#58413c] mb-4 line-clamp-2">
                {deck.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#58413c] font-['Hanken_Grotesk',sans-serif] font-medium">
                <span>{deck.cardCount} kartu</span>
                <span>&bull;</span>
                <span>{deck.estimatedDuration}</span>
            </div>
        </Link>
    );
}
