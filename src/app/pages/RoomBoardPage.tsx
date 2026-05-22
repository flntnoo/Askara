'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Loader2,
  RotateCcw,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react';
import RoomJoinForm from '../components/RoomJoinForm';
import { apiRequest } from '../../lib/api-client';
import type { MultiplayerRoom, RoomCardState } from '../../types';
import { saveJoinedRoomPlayer } from '../../utils/storage';

export default function RoomBoardPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [selectedCard, setSelectedCard] = useState<RoomCardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState<string | null>(null);
  const [isAdvancingTurn, setIsAdvancingTurn] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoom = useCallback(async () => {
    if (!code) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${code.toUpperCase()}`);

      if (nextRoom.currentPlayerId) {
        saveJoinedRoomPlayer(nextRoom.code, nextRoom.currentPlayerId);
      }

      if (nextRoom.status === 'waiting') {
        if (nextRoom.currentPlayerId) {
          router.replace(`/room/${nextRoom.code}/lobby`);
        } else {
          setRoom(nextRoom);
        }

        return;
      }

      setRoom(nextRoom);
      setSelectedCard((current) => current ?? nextRoom.latestRevealedCard ?? null);
    } catch (loadError) {
      console.error('Failed to load multiplayer room:', loadError);
      setError('Room tidak ditemukan atau sudah tidak bisa dibuka.');
    } finally {
      setIsLoading(false);
    }
  }, [code, router]);

  useEffect(() => {
    void loadRoom();
  }, [loadRoom]);

  const unrevealedCards = useMemo(
    () => room?.cards.filter((card) => !card.isRevealed) ?? [],
    [room],
  );
  const revealedCount = room?.cards.filter((card) => card.isRevealed).length ?? 0;
  const totalCount = room?.cards.length ?? 0;
  const remainingCount = unrevealedCards.length;
  const progressPercent = totalCount > 0 ? (revealedCount / totalCount) * 100 : 0;
  const currentTurnPlayer = room?.players.find((player) => player.id === room.currentTurnPlayerId);
  const isComplete = totalCount > 0 && remainingCount === 0;

  const revealCard = async (card: RoomCardState) => {
    if (!room || card.isRevealed || isRevealing || room.status !== 'active') return;

    setIsRevealing(card.id);
    setError(null);

    try {
      const nextRoom = await apiRequest<MultiplayerRoom>(
        `/api/rooms/${room.code}/cards/${card.id}/reveal`,
        {
          method: 'POST',
        },
      );
      setRoom(nextRoom);
      setSelectedCard(nextRoom.latestRevealedCard ?? null);
    } catch (revealError) {
      console.error('Failed to reveal room card:', revealError);
      setError('Kartu belum bisa dibuka. Pastikan kamu sudah join dan giliranmu aktif.');
    } finally {
      setIsRevealing(null);
    }
  };

  const nextTurn = async () => {
    if (!room || isAdvancingTurn || room.status !== 'active') return;

    setIsAdvancingTurn(true);
    setError(null);

    try {
      const nextRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${room.code}/next-turn`, {
        method: 'POST',
      });
      setRoom(nextRoom);
    } catch (turnError) {
      console.error('Failed to move to next turn:', turnError);
      setError('Giliran belum bisa dipindahkan. Pastikan kamu sudah join room ini.');
    } finally {
      setIsAdvancingTurn(false);
    }
  };

  const endRoom = async () => {
    if (!room || isEnding || room.status === 'completed') return;

    setIsEnding(true);
    setError(null);

    try {
      const endedRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${room.code}/end`, {
        method: 'POST',
      });
      setRoom(endedRoom);
    } catch (endError) {
      console.error('Failed to end multiplayer room:', endError);
      setError('Room hanya bisa diakhiri oleh host.');
    } finally {
      setIsEnding(false);
    }
  };

  const copyCode = async () => {
    if (!room?.code || typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(room.code);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f8] p-6">
        <div className="flex items-center gap-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Membuka room...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcf9f8] p-6 text-center">
        <h1 className="mb-3 font-['Hanken_Grotesk',sans-serif] text-2xl font-bold text-[#1c1b1b]">
          Room tidak ditemukan
        </h1>
        <p className="mb-6 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
          {error ?? 'Coba masukkan kode room dari halaman multiplayer.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/decks')}
          className="min-h-11 rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]"
        >
          Kembali ke Decks
        </button>
      </div>
    );
  }

  if (!room.currentPlayerId) {
    return (
      <RoomJoinForm
        code={room.code}
        room={room}
        onJoined={(joinedRoom) => {
          if (joinedRoom.status === 'waiting') {
            router.replace(`/room/${joinedRoom.code}/lobby`);
            return;
          }

          setRoom(joinedRoom);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <header className="border-b-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
          <Link
            href={`/multiplayer/${room.deck.slug}`}
            aria-label="Kembali ke setup multiplayer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#58413c] hover:text-[#a93718]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate font-['Hanken_Grotesk',sans-serif] text-lg font-extrabold md:text-2xl">
              {room.deck.name}
            </p>
            <button
              type="button"
              onClick={() => void copyCode()}
              className="inline-flex items-center justify-center gap-2 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#a93718]"
            >
              {room.code}
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => void endRoom()}
            disabled={isEnding || room.status === 'completed'}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#58413c] hover:text-[#a93718] disabled:opacity-45"
            aria-label="Akhiri room"
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

      <main className="mx-auto grid max-w-[1180px] gap-6 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold md:text-4xl">
                Multiplayer Room
              </h1>
              <p className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
                {remainingCount} remaining / {revealedCount} opened
              </p>
            </div>
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

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-white px-3 py-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
              <UsersRound className="h-4 w-4" />
              {room.players.length} players
            </div>
            {currentTurnPlayer && (
              <div className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-[#ffe087] px-3 py-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500]">
                <RotateCcw className="h-4 w-4" />
                {currentTurnPlayer.displayName}
              </div>
            )}
            <button
              type="button"
              onClick={() => void nextTurn()}
              disabled={isAdvancingTurn || room.status !== 'active'}
              className="min-h-10 rounded-lg border-2 border-[#1c1b1b] bg-white px-4 py-2 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] hover:shadow-[3px_3px_0px_#1c1b1b] disabled:opacity-50"
            >
              {isAdvancingTurn ? 'Loading...' : 'Next Turn'}
            </button>
          </div>

          {room.status === 'active' ? (
            unrevealedCards.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {unrevealedCards.map((card) => {
                const showBusy = isRevealing === card.id;
                const cardBackImageSrc = card.card.cardBackImageSrc;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => void revealCard(card)}
                    disabled={showBusy || room.status !== 'active'}
                    aria-label={`Buka kartu ${card.position + 1}`}
                    className="group relative aspect-[3/4] rounded-xl border-2 border-[#1c1b1b] bg-[#ffe087] text-left transition-all hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#1c1b1b] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff7551] disabled:opacity-60"
                  >
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${
                        cardBackImageSrc ? 'overflow-hidden rounded-xl' : 'p-3'
                      }`}
                    >
                      {cardBackImageSrc && (
                        <Image
                          src={cardBackImageSrc}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 20vw, 33vw"
                          className="object-cover"
                        />
                      )}
                      {showBusy ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#a93718]" />
                      ) : !cardBackImageSrc ? (
                        <>
                          <span className="text-3xl md:text-4xl">{room.deck.icon}</span>
                          <span className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718]">
                            #{card.position + 1}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
            ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center border-4 border-[#1c1b1b] bg-white p-8 text-center shadow-[6px_6px_0px_#1c1b1b]">
              <Trophy className="mb-4 h-10 w-10 text-[#a93718]" />
              <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
                Semua kartu sudah terbuka
              </h2>
            </div>
            )
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center border-4 border-[#1c1b1b] bg-white p-8 text-center shadow-[6px_6px_0px_#1c1b1b]">
              <Trophy className="mb-4 h-10 w-10 text-[#a93718]" />
              <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
                Room sudah selesai
              </h2>
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AnimatePresence mode="wait">
            {selectedCard ? (
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
                {selectedCard.revealedByPlayerName && (
                  <p className="mt-5 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
                    Dibuka oleh {selectedCard.revealedByPlayerName}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="border-4 border-[#1c1b1b] bg-[#f0edec] p-6 shadow-[6px_6px_0px_#1c1b1b]"
              >
                <h2 className="mb-2 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
                  Belum ada kartu terbuka
                </h2>
                <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
                  Kartu yang dibuka akan muncul di sini dan hilang dari grid utama.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="mt-4 rounded-xl border-2 border-[#1c1b1b] bg-white p-4 shadow-[4px_4px_0px_#1c1b1b]">
            <h2 className="mb-3 font-['Hanken_Grotesk',sans-serif] text-lg font-extrabold">
              Players
            </h2>
            <div className="grid gap-2">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between rounded-lg border-2 border-[#1c1b1b] px-3 py-2 font-['Hanken_Grotesk',sans-serif] font-bold ${
                    player.id === room.currentTurnPlayerId ? 'bg-[#ffe087]' : 'bg-[#fcf9f8]'
                  }`}
                >
                  <span>{player.displayName}</span>
                  <span className="text-xs uppercase text-[#58413c]">{player.role}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
