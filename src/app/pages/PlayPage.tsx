'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, SkipForward, ChevronRight, X } from 'lucide-react';
import { CARDS } from '../../data/cards';
import { getDeckById } from '../../data/decks';
import { ConversationCard } from '../../types';
import { getNextCard } from '../../utils/cardEngine';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useSessionStore } from '../../stores/sessionStore';

const cardTransition = {
  duration: 0.22,
  ease: 'easeOut',
} as const;

export default function PlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const activeSession = useSessionStore((state) => state.activeSession);
  const restoreSession = useSessionStore((state) => state.restoreSession);
  const setCurrentCard = useSessionStore((state) => state.setCurrentCard);
  const markViewed = useSessionStore((state) => state.markViewed);
  const markSkipped = useSessionStore((state) => state.markSkipped);
  const toggleFavoriteInSession = useSessionStore((state) => state.toggleFavoriteInSession);
  const endSession = useSessionStore((state) => state.endSession);
  const refreshFavorites = useFavoriteStore((state) => state.refreshFavorites);
  const [currentCard, setCurrentCardState] = useState<ConversationCard | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFirstCardHint, setShowFirstCardHint] = useState(true);

  const deck = activeSession ? getDeckById(activeSession.deckId) : undefined;
  const deckCards = useMemo(
    () => (activeSession ? CARDS.filter((card) => card.deckId === activeSession.deckId) : []),
    [activeSession]
  );

  useEffect(() => {
    if (!sessionId) return;
    const restored = restoreSession(sessionId);
    if (!restored || restored.status !== 'active') {
      router.replace('/home');
    }
  }, [restoreSession, router, sessionId]);

  useEffect(() => {
    if (!activeSession) return;

    const existingCurrent = activeSession.currentCardId
      ? CARDS.find((card) => card.id === activeSession.currentCardId)
      : undefined;
    const canKeepExisting =
      existingCurrent &&
      !activeSession.viewedCardIds.includes(existingCurrent.id) &&
      !activeSession.skippedCardIds.includes(existingCurrent.id);

    const nextCard =
      canKeepExisting && existingCurrent
        ? existingCurrent
        : getNextCard({
            deckId: activeSession.deckId,
            allCards: CARDS,
            viewedCardIds: activeSession.viewedCardIds,
            skippedCardIds: activeSession.skippedCardIds,
          });

    if (!nextCard) {
      endSession();
      router.replace(`/summary/${activeSession.id}`);
      return;
    }

    if (nextCard.id !== activeSession.currentCardId) {
      setCurrentCard(nextCard.id);
    }
    setCurrentCardState(nextCard);
    if (nextCard.id !== currentCard?.id) {
      setIsFlipped(false);
    }
  }, [activeSession, currentCard?.id, endSession, router, setCurrentCard]);

  if (!activeSession || !deck || !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-4">
          Sesi tidak ditemukan
        </h1>
        <Link
          href="/home"
          className="text-[#a93718] font-['Hanken_Grotesk',sans-serif] font-bold hover:underline"
        >
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const completeAndGoToSummary = () => {
    endSession();
    router.push(`/summary/${activeSession.id}`);
  };

  const loadNextAfterAction = () => {
    const updatedSession = useSessionStore.getState().activeSession;
    if (!updatedSession) return;

    const nextCard = getNextCard({
      deckId: updatedSession.deckId,
      allCards: CARDS,
      viewedCardIds: updatedSession.viewedCardIds,
      skippedCardIds: updatedSession.skippedCardIds,
    });

    if (!nextCard) {
      completeAndGoToSummary();
      return;
    }

    setCurrentCard(nextCard.id);
    setCurrentCardState(nextCard);
    setIsFlipped(false);
  };

  const handleNext = () => {
    markViewed(currentCard.id);
    loadNextAfterAction();
  };

  const handleSkip = () => {
    markSkipped(currentCard.id);
    loadNextAfterAction();
  };

  const handleFlipCard = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowFirstCardHint(false);
    }
  };

  const handleFavorite = () => {
    toggleFavoriteInSession(currentCard.id);
    refreshFavorites();
  };

  const isFavorite = activeSession.favoriteCardIds.includes(currentCard.id);
  const progress = activeSession.viewedCardIds.length + activeSession.skippedCardIds.length;
  const total = deckCards.length;
  const cardBackImageSrc = currentCard.cardBackImageSrc;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#fcf9f8] relative">
      <div className="bg-[#fcf9f8] border-b-2 border-[#1c1b1b] px-4 md:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setShowEndDialog(true)}
          aria-label="close"
          className="min-h-11 min-w-11 flex items-center justify-center text-[#58413c] hover:text-[#a93718] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm md:text-base text-[#58413c]">
            {deck.name}
          </span>
          <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm md:text-base text-[#a93718]">
            {progress}/{total}
          </span>
        </div>
      </div>

      <div className="w-full h-2 bg-[#f0edec] border-b-2 border-[#1c1b1b]">
        <div
          className="h-full bg-[#ff7551] transition-all duration-300"
          style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        {showFirstCardHint && !isFlipped && (
          <div className="bg-[#ffe087] border-2 border-[#1c1b1b] rounded-xl px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] text-center shadow-[4px_4px_0px_#1c1b1b] motion-safe:animate-bounce">
            Ketuk kartu untuk melihat pertanyaan
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, rotate: -1 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, rotate: 1 }}
            transition={cardTransition}
            className="w-full max-w-2xl"
            style={{ perspective: '1000px' }}
          >
            <button
              type="button"
              onClick={handleFlipCard}
              aria-label="Buka kartu"
              className="block text-left w-full min-h-[300px] md:min-h-[400px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff7551]"
            >
              <div
                className="relative w-full min-h-[300px] md:min-h-[400px] transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  className={`absolute inset-0 hover:scale-105 transition-transform ${
                    isFlipped ? 'pointer-events-none' : ''
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className="relative size-full border-4 border-[#1c1b1b] rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_#1c1b1b] flex flex-col items-center justify-center gap-6"
                    style={!cardBackImageSrc ? { backgroundColor: deck.color || '#ffe087' } : undefined}
                  >
                    {cardBackImageSrc ? (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <Image
                          src={cardBackImageSrc}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-6xl md:text-8xl">{deck.icon}</div>
                        <div className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] text-center tracking-[-0.96px]">
                          {deck.name}
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border-2 border-[#1c1b1b] rounded-xl px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] text-center motion-safe:animate-pulse shadow-[2px_2px_0px_#1c1b1b]">
                          Ketuk untuk membuka kartu
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="size-full bg-white border-4 border-[#1c1b1b] rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_#1c1b1b] flex items-center justify-center">
                    <p className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] md:text-[32px] text-[#1c1b1b] text-center leading-relaxed">
                      "{currentCard.content}"
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-[#fcf9f8] border-t-2 border-[#1c1b1b] px-4 md:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {!isFlipped ? (
            <div className="text-center py-4">
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
                Ketuk kartu untuk melihat pertanyaan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                type="button"
                onClick={handleFavorite}
                aria-label="favorite"
                aria-pressed={isFavorite}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                className={`min-h-11 flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#1c1b1b] transition-all ${
                  isFavorite
                    ? 'bg-[#ffe087] shadow-[4px_4px_0px_#1c1b1b]'
                    : 'bg-white hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? 'text-[#a93718]' : 'text-[#58413c]'}`}
                  fill={isFavorite ? '#a93718' : 'none'}
                />
                <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#1c1b1b]">
                  {isFavorite ? 'Tersimpan' : 'Simpan'}
                </span>
              </motion.button>

              <button
                type="button"
                onClick={handleSkip}
                aria-label="skip"
                className="min-h-11 flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#1c1b1b] bg-white hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px] transition-all"
              >
                <SkipForward className="w-6 h-6 text-[#58413c]" />
                <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#1c1b1b]">
                  Lewati
                </span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="next"
                className="min-h-11 flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#1c1b1b] bg-[#ff7551] shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
              >
                <ChevronRight className="w-6 h-6 text-[#6b1500]" />
                <span className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#6b1500]">
                  Lanjut
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showEndDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-[#1c1b1b] rounded-2xl p-8 max-w-md w-full shadow-[8px_8px_0px_#1c1b1b]">
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-4">
              Akhiri Sesi?
            </h3>
            <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] mb-6">
              Kamu sudah membuka {activeSession.viewedCardIds.length} kartu. Yakin ingin mengakhiri sesi sekarang?
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowEndDialog(false)}
                aria-label="close"
                className="flex-1 min-h-11 bg-[#f0edec] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px] transition-all"
              >
                Lanjut Main
              </button>
              <button
                type="button"
                onClick={completeAndGoToSummary}
                className="flex-1 min-h-11 bg-[#ff7551] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
              >
                Akhiri
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
