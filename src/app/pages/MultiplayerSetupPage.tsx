'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2, LogIn, Plus, UsersRound } from 'lucide-react';
import { getDeckListingCoverSrc } from '../../data/deckListingCovers';
import { getDeckBySlug } from '../../data/decks';
import { ApiClientError, apiRequest } from '../../lib/api-client';
import type { MultiplayerRoom } from '../../types';
import { saveJoinedRoomPlayer, saveMultiplayerDeckId } from '../../utils/storage';

export default function MultiplayerSetupPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const deck = slug ? getDeckBySlug(slug) : undefined;
  const [hostName, setHostName] = useState('');
  const [joinDisplayName, setJoinDisplayName] = useState('');
  const [hasEditedHostName, setHasEditedHostName] = useState(false);
  const [hasEditedJoinName, setHasEditedJoinName] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionName = session?.user?.name?.trim();

    if (!sessionName) return;
    if (!hasEditedHostName) setHostName(sessionName);
    if (!hasEditedJoinName) setJoinDisplayName(sessionName);
  }, [hasEditedHostName, hasEditedJoinName, session?.user?.name]);

  useEffect(() => {
    if (deck?.id) {
      saveMultiplayerDeckId(deck.id);
    }
  }, [deck?.id]);

  if (!deck) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcf9f8] p-6 text-center">
        <h1 className="mb-4 font-['Hanken_Grotesk',sans-serif] text-2xl font-bold text-[#1c1b1b]">
          Deck tidak ditemukan
        </h1>
        <Link
          href="/decks"
          className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#a93718] hover:underline"
        >
          Kembali ke Semua Deck
        </Link>
      </div>
    );
  }

  const coverSrc = getDeckListingCoverSrc(deck.slug);

  const createRoom = async () => {
    const trimmedHostName = hostName.trim();

    if (isCreating) return;

    if (!trimmedHostName) {
      setError('Masukkan host name terlebih dahulu.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const room = await apiRequest<MultiplayerRoom>('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({
          deckId: deck.id,
          displayName: trimmedHostName,
        }),
      });

      if (room.currentPlayerId) {
        saveJoinedRoomPlayer(room.code, room.currentPlayerId);
      }

      router.push(`/room/${room.code}/lobby`);
    } catch (createError) {
      console.error('Failed to create multiplayer room:', createError);
      setError('Room belum bisa dibuat. Coba lagi sebentar.');
      setIsCreating(false);
    }
  };

  const joinRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCode = roomCode.trim().toUpperCase();
    const trimmedDisplayName = joinDisplayName.trim();

    if (!normalizedCode || isJoining) {
      setError('Masukkan room code terlebih dahulu.');
      return;
    }

    if (!trimmedDisplayName) {
      setError('Masukkan display name terlebih dahulu.');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const room = await apiRequest<MultiplayerRoom>(`/api/rooms/${normalizedCode}/join`, {
        method: 'POST',
        body: JSON.stringify({
          deckId: deck.id,
          displayName: trimmedDisplayName,
        }),
      });

      if (room.currentPlayerId) {
        saveJoinedRoomPlayer(room.code, room.currentPlayerId);
      }

      router.push(`/room/${room.code}/lobby`);
    } catch (joinError) {
      console.error('Failed to join multiplayer room:', joinError);
      if (
        joinError instanceof ApiClientError &&
        joinError.message.startsWith('Room ini menggunakan deck')
      ) {
        setError(joinError.message);
      } else {
        setError('Room code tidak valid atau game sudah dimulai.');
      }
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <main className="mx-auto max-w-[960px] px-4 py-6 md:px-8 md:py-10">
        <Link
          href={`/decks/${deck.slug}`}
          className="mb-8 inline-flex items-center gap-2 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] transition-colors hover:text-[#a93718]"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Deck
        </Link>

        <section className="mb-8 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-[#1c1b1b] shadow-[8px_8px_0px_#1c1b1b]">
            <Image
              src={coverSrc}
              alt={`${deck.name} cover`}
              fill
              sizes="(min-width: 768px) 220px, 70vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-white px-3 py-2 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
              <UsersRound className="h-4 w-4" />
              Multiplayer
            </div>
            <h1 className="mb-2 font-['Hanken_Grotesk',sans-serif] text-[36px] font-extrabold leading-tight md:text-[52px]">
              {deck.name}
            </h1>
            <p className="max-w-2xl font-['Hanken_Grotesk',sans-serif] text-lg font-medium text-[#58413c]">
              {deck.description}
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 border-2 border-[#1c1b1b] bg-[#ffe087] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500]">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border-2 border-[#1c1b1b] bg-white p-5 shadow-[5px_5px_0px_#1c1b1b]">
            <h2 className="mb-4 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
              Create Room
            </h2>
            <label className="mb-2 block font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
              Display name
            </label>
            <input
              value={hostName}
              onChange={(event) => {
                setHasEditedHostName(true);
                setHostName(event.target.value);
              }}
              maxLength={40}
              className="mb-4 min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 font-['Hanken_Grotesk',sans-serif] font-bold outline-none focus:ring-4 focus:ring-[#ff7551]"
              placeholder="Aldo"
            />
            <button
              type="button"
              onClick={createRoom}
              disabled={isCreating || isJoining}
              className="min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-5 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] disabled:opacity-60"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                Create Room
              </span>
            </button>
          </section>

          <form
            onSubmit={(event) => void joinRoom(event)}
            className="rounded-xl border-2 border-[#1c1b1b] bg-white p-5 shadow-[5px_5px_0px_#1c1b1b]"
          >
            <h2 className="mb-4 font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold">
              Join Room
            </h2>
            <label className="mb-2 block font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
              Room code
            </label>
            <input
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              maxLength={12}
              className="mb-4 min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 font-['Hanken_Grotesk',sans-serif] text-xl font-extrabold tracking-[0.16em] outline-none focus:ring-4 focus:ring-[#ff7551]"
              placeholder="ABC123"
            />
            <label className="mb-2 block font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
              Display name
            </label>
            <input
              value={joinDisplayName}
              onChange={(event) => {
                setHasEditedJoinName(true);
                setJoinDisplayName(event.target.value);
              }}
              maxLength={40}
              className="mb-4 min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 font-['Hanken_Grotesk',sans-serif] font-bold outline-none focus:ring-4 focus:ring-[#ff7551]"
              placeholder="Maya"
            />
            <button
              type="submit"
              disabled={isCreating || isJoining}
              className="min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-white px-5 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] disabled:opacity-60"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isJoining ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                Join Room
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
