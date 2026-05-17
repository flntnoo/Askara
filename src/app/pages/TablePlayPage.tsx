'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, DoorOpen, Loader2, X } from 'lucide-react';
import type { TableCardState, TableSession } from '../../types';
import { apiRequest } from '../../lib/api-client';

export default function TablePlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [session, setSession] = useState<TableSession | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const tableSession = await apiRequest<TableSession>(`/api/table-sessions/${sessionId}`);
      setSession(tableSession);

      const latestRevealed = [...tableSession.cards]
        .reverse()
        .find((state) => state.isRevealed);

      setSelectedCardId((current) => current ?? latestRevealed?.id ?? null);
    } catch (loadError) {
      console.error('Failed to load table session:', loadError);
      setError('Sesi table tidak ditemukan atau sudah tidak bisa dibuka.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const selectedCard = useMemo(
    () => session?.cards.find((state) => state.id === selectedCardId) ?? null,
    [selectedCardId, session],
  );

  const revealedCount = session?.cards.filter((state) => state.isRevealed).length ?? 0;
  const totalCount = session?.cards.length ?? 0;
  const progressPercent = totalCount > 0 ? (revealedCount / totalCount) * 100 : 0;
  const isComplete = totalCount > 0 && revealedCount === totalCount;

  const revealCard = async (state: TableCardState) => {
    if (!session || state.isRevealed || isRevealing || session.status !== 'active') {
      if (state.isRevealed) {
        setSelectedCardId(state.id);
      }
      return;
    }

    setIsRevealing(state.id);
    setError(null);
    setSelectedCardId(state.id);

    try {
      const nextSession = await apiRequest<TableSession>(
        `/api/table-sessions/${session.id}/reveal`,
        {
          method: 'POST',
          body: JSON.stringify({ sessionCardStateId: state.id }),
        },
      );
      setSession(nextSession);
      setSelectedCardId(state.id);
    } catch (revealError) {
      console.error('Failed to reveal table card:', revealError);
      setError('Kartu belum bisa dibuka. Coba lagi sebentar.');
    } finally {
      setIsRevealing(null);
    }
  };

  const endSession = async () => {
    if (!session || isEnding) return;

    setIsEnding(true);
    setError(null);

    try {
      const endedSession = await apiRequest<TableSession>(`/api/table-sessions/${session.id}/end`, {
        method: 'POST',
      });
      setSession(endedSession);
    } catch (endError) {
      console.error('Failed to end table session:', endError);
      setError('Sesi belum bisa diakhiri. Coba lagi sebentar.');
    } finally {
      setIsEnding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Membuka table...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-3">
          Sesi tidak ditemukan
        </h1>
        <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] mb-6">
          {error ?? 'Coba mulai ulang dari deck yang ingin dimainkan.'}
        </p>
        <Link
          href="/decks"
          className="min-h-11 inline-flex items-center justify-center bg-[#ff7551] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]"
        >
          Kembali ke Decks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <header className="border-b-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1152px] items-center justify-between gap-4">
          <Link
            href={`/decks/${session.deck.slug}`}
            aria-label="Kembali ke deck"
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-[#58413c] hover:text-[#a93718]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate font-['Hanken_Grotesk',sans-serif] font-extrabold text-lg md:text-2xl">
              {session.deck.name}
            </p>
            <p className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#a93718]">
              {revealedCount}/{totalCount} terbuka
            </p>
          </div>
          <button
            type="button"
            onClick={endSession}
            disabled={isEnding || session.status !== 'active'}
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-[#58413c] hover:text-[#a93718] disabled:opacity-45"
            aria-label="Akhiri sesi"
          >
            {isEnding ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div className="h-2 border-b-2 border-[#1c1b1b] bg-[#f0edec]">
        <div
          className="h-full bg-[#ff7551] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="mx-auto grid max-w-[1152px] gap-6 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-2xl md:text-4xl">
              Choose Cards
            </h1>
            {isComplete && (
              <span className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-[#b5ead7] px-3 py-2 font-['Hanken_Grotesk',sans-serif] text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
                Selesai
              </span>
            )}
          </div>

          {error && (
            <div className="mb-4 border-2 border-[#1c1b1b] bg-[#ffe087] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {session.cards.map((state) => {
              const isSelected = selectedCardId === state.id;
              const showBusy = isRevealing === state.id;

              return (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => void revealCard(state)}
                  disabled={showBusy || session.status !== 'active'}
                  aria-label={
                    state.isRevealed
                      ? `Kartu ${state.position + 1}: ${state.card.content}`
                      : `Buka kartu ${state.position + 1}`
                  }
                  className={`group relative aspect-[3/4] rounded-xl border-2 border-[#1c1b1b] text-left transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff7551] ${
                    isSelected
                      ? 'shadow-[4px_4px_0px_#1c1b1b] translate-y-[-2px]'
                      : 'hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
                  } ${state.isRevealed ? 'bg-white' : 'bg-[#ffe087]'}`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[10px]">
                    <div
                      className="h-full w-full transition-transform duration-500"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: state.isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        {showBusy ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[#a93718]" />
                        ) : (
                          <>
                            <span className="text-3xl md:text-4xl">{session.deck.icon}</span>
                            <span className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718]">
                              #{state.position + 1}
                            </span>
                          </>
                        )}
                      </div>
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-white p-3"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <p className="line-clamp-4 font-['Hanken_Grotesk',sans-serif] text-sm font-bold leading-snug">
                          {state.card.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AnimatePresence mode="wait">
            {selectedCard?.isRevealed ? (
              <motion.div
                key={selectedCard.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="border-4 border-[#1c1b1b] bg-white p-6 shadow-[6px_6px_0px_#1c1b1b]"
              >
                <p className="mb-3 font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718]">
                  Kartu #{selectedCard.position + 1}
                </p>
                <p className="font-['Hanken_Grotesk',sans-serif] text-2xl font-bold leading-relaxed">
                  "{selectedCard.card.content}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="border-4 border-[#1c1b1b] bg-[#f0edec] p-6 shadow-[6px_6px_0px_#1c1b1b]"
              >
                <DoorOpen className="mb-4 h-8 w-8 text-[#a93718]" />
                <h2 className="mb-2 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
                  Pilih satu kartu
                </h2>
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
                  Kartu yang sudah dibuka akan tetap terlihat, termasuk setelah halaman di-refresh.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href={`/decks/${session.deck.slug}`}
              className="min-h-11 inline-flex items-center justify-center rounded-lg border-2 border-[#1c1b1b] bg-white px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] hover:shadow-[3px_3px_0px_#1c1b1b]"
            >
              Back to Deck
            </Link>
            <button
              type="button"
              onClick={endSession}
              disabled={isEnding || session.status !== 'active'}
              className="min-h-11 inline-flex items-center justify-center rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[3px_3px_0px_#1c1b1b] disabled:opacity-45"
            >
              {session.status === 'active' ? 'End Session' : 'Ended'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
