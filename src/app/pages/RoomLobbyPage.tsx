'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  Link2,
  Loader2,
  Play,
  UsersRound,
} from 'lucide-react';
import RoomJoinForm from '../components/RoomJoinForm';
import { apiRequest } from '../../lib/api-client';
import { getDeckListingCoverSrc } from '../../data/deckListingCovers';
import type { MultiplayerRoom } from '../../types';
import { saveJoinedRoomPlayer } from '../../utils/storage';

export default function RoomLobbyPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activePlayers = useMemo(
    () => room?.players.filter((player) => player.isActive) ?? [],
    [room],
  );
  const canStart = Boolean(room?.isCurrentUserHost && activePlayers.length >= 2);
  const roomLink =
    typeof window === 'undefined' || !room
      ? ''
      : `${window.location.origin}/room/${room.code}/lobby`;

  const loadRoom = useCallback(
    async (showLoading = false) => {
      if (!code) return;

      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const nextRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${code.toUpperCase()}`);
        setRoom(nextRoom);
        setError(null);

        if (nextRoom.currentPlayerId) {
          saveJoinedRoomPlayer(nextRoom.code, nextRoom.currentPlayerId);
        }

        if (nextRoom.status === 'active' && nextRoom.currentPlayerId) {
          router.replace(`/room/${nextRoom.code}`);
        }
      } catch (loadError) {
        console.error('Failed to load room lobby:', loadError);
        setError('Room tidak ditemukan atau sudah tidak bisa dibuka.');
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [code, router],
  );

  useEffect(() => {
    void loadRoom(true);
  }, [loadRoom]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadRoom();
    }, 2000);

    return () => window.clearInterval(timer);
  }, [loadRoom]);

  const copyValue = async (value: string, kind: 'code' | 'link') => {
    if (!value || typeof navigator === 'undefined' || !navigator.clipboard) return;

    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const startGame = async () => {
    if (!room || isStarting || !canStart) return;

    setIsStarting(true);
    setError(null);

    try {
      const nextRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${room.code}/start`, {
        method: 'POST',
      });
      setRoom(nextRoom);
      router.replace(`/room/${nextRoom.code}`);
    } catch (startError) {
      console.error('Failed to start multiplayer room:', startError);
      setError('Game belum bisa dimulai. Pastikan kamu host dan minimal ada 2 pemain.');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f8] p-6">
        <div className="flex items-center gap-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Membuka lobby...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcf9f8] p-6 text-center">
        <h1 className="mb-3 font-['Hanken_Grotesk',sans-serif] text-2xl font-bold text-[#1c1b1b]">
          Lobby tidak ditemukan
        </h1>
        <p className="mb-6 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
          {error ?? 'Coba masukkan kode room dari halaman multiplayer.'}
        </p>
        <Link
          href="/decks"
          className="min-h-11 rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]"
        >
          Kembali ke Decks
        </Link>
      </div>
    );
  }

  const coverSrc = getDeckListingCoverSrc(room.deck.slug);

  if (!room.currentPlayerId) {
    return (
      <RoomJoinForm
        code={room.code}
        room={room}
        onJoined={(joinedRoom) => {
          setRoom(joinedRoom);

          if (joinedRoom.status === 'active') {
            router.replace(`/room/${joinedRoom.code}`);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <main className="mx-auto max-w-[1080px] px-4 py-6 md:px-8 md:py-10">
        <Link
          href={`/multiplayer/${room.deck.slug}`}
          className="mb-8 inline-flex items-center gap-2 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] transition-colors hover:text-[#a93718]"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Multiplayer
        </Link>

        <section className="mb-6 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-[#1c1b1b] shadow-[8px_8px_0px_#1c1b1b]">
            <Image
              src={coverSrc}
              alt={`${room.deck.name} cover`}
              fill
              sizes="(min-width: 768px) 220px, 70vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-white px-3 py-2 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
              <UsersRound className="h-4 w-4" />
              Waiting Room
            </div>
            <h1 className="mb-3 font-['Hanken_Grotesk',sans-serif] text-[36px] font-extrabold leading-tight md:text-[52px]">
              {room.deck.name}
            </h1>
            <p className="max-w-2xl font-['Hanken_Grotesk',sans-serif] text-lg font-medium text-[#58413c]">
              Bagikan kode room, tunggu pemain masuk, lalu host dapat memulai game.
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 border-2 border-[#1c1b1b] bg-[#ffe087] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500]">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border-2 border-[#1c1b1b] bg-white p-5 shadow-[5px_5px_0px_#1c1b1b]">
            <h2 className="mb-4 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
              Room Code
            </h2>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void copyValue(room.code, 'code')}
                className="min-h-14 flex-1 rounded-lg border-2 border-[#1c1b1b] bg-[#ffe087] px-4 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold tracking-[0.16em] text-[#6b1500] shadow-[3px_3px_0px_#1c1b1b]"
              >
                <span className="inline-flex items-center justify-center gap-3">
                  {room.code}
                  {copied === 'code' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </span>
              </button>
              <button
                type="button"
                onClick={() => void copyValue(roomLink, 'link')}
                className="min-h-14 rounded-lg border-2 border-[#1c1b1b] bg-white px-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] shadow-[3px_3px_0px_#1c1b1b]"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {copied === 'link' ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
                  Copy Link
                </span>
              </button>
            </div>

            <div className="mt-4">
              {room.isCurrentUserHost ? (
                <button
                  type="button"
                  onClick={() => void startGame()}
                  disabled={!canStart || isStarting || room.status !== 'waiting'}
                  className="min-h-12 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-5 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {isStarting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                    Start Game
                  </span>
                </button>
              ) : (
                <div className="rounded-lg border-2 border-[#1c1b1b] bg-[#f0edec] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c]">
                  Waiting for host to start the game
                </div>
              )}
              {room.isCurrentUserHost && activePlayers.length < 2 && (
                <p className="mt-3 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
                  Minimal 2 pemain aktif dibutuhkan untuk mulai.
                </p>
              )}
            </div>
          </section>

          <aside className="rounded-xl border-2 border-[#1c1b1b] bg-white p-5 shadow-[5px_5px_0px_#1c1b1b]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
                Players
              </h2>
              <span className="rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-3 py-1 font-['Hanken_Grotesk',sans-serif] text-sm font-bold">
                {activePlayers.length}
              </span>
            </div>
            <div className="grid gap-2">
              {activePlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-3 rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-3 py-3 font-['Hanken_Grotesk',sans-serif] font-bold"
                >
                  <span className="min-w-0 truncate">{player.displayName}</span>
                  {player.role === 'host' ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#ffe087] px-2 py-1 text-xs uppercase text-[#6b1500]">
                      <Crown className="h-3.5 w-3.5" />
                      Host
                    </span>
                  ) : (
                    <span className="text-xs uppercase text-[#58413c]">Player</span>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
