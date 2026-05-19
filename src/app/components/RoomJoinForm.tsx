'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, LogIn, UsersRound } from 'lucide-react';
import { apiRequest } from '../../lib/api-client';
import type { MultiplayerRoom } from '../../types';
import { saveJoinedRoomPlayer } from '../../utils/storage';

type RoomJoinFormProps = {
  code: string;
  room?: MultiplayerRoom | null;
  onJoined: (room: MultiplayerRoom) => void;
};

export default function RoomJoinForm({ code, room, onJoined }: RoomJoinFormProps) {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [hasEditedName, setHasEditedName] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedCode = (room?.code ?? code).trim().toUpperCase();

  useEffect(() => {
    const sessionName = session?.user?.name?.trim();

    if (!hasEditedName && sessionName) {
      setDisplayName(sessionName);
    }
  }, [hasEditedName, session?.user?.name]);

  const joinRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setError('Masukkan display name terlebih dahulu.');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const joinedRoom = await apiRequest<MultiplayerRoom>(`/api/rooms/${normalizedCode}/join`, {
        method: 'POST',
        body: JSON.stringify({
          displayName: trimmedName,
        }),
      });

      if (joinedRoom.currentPlayerId) {
        saveJoinedRoomPlayer(joinedRoom.code, joinedRoom.currentPlayerId);
      }

      onJoined(joinedRoom);
    } catch (joinError) {
      console.error('Failed to join multiplayer room:', joinError);
      setError('Room belum bisa di-join. Pastikan kode benar dan game belum dimulai.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] px-4 py-8 text-[#1c1b1b]">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[520px] items-center">
        <form
          onSubmit={(event) => void joinRoom(event)}
          className="w-full rounded-xl border-2 border-[#1c1b1b] bg-white p-5 shadow-[5px_5px_0px_#1c1b1b]"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-3 py-2 font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
            <UsersRound className="h-4 w-4" />
            Join Room
          </div>
          <h1 className="mb-2 font-['Hanken_Grotesk',sans-serif] text-3xl font-extrabold">
            {room?.deck.name ?? 'Multiplayer Room'}
          </h1>
          <p className="mb-5 font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c]">
            Pilih nama yang akan terlihat oleh pemain lain di room ini.
          </p>

          {error && (
            <div className="mb-4 border-2 border-[#1c1b1b] bg-[#ffe087] px-4 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500]">
              {error}
            </div>
          )}

          <label className="mb-2 block font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
            Room code
          </label>
          <input
            value={normalizedCode}
            readOnly
            className="mb-4 min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#f0edec] px-4 font-['Hanken_Grotesk',sans-serif] text-xl font-extrabold tracking-[0.16em] outline-none"
          />

          <label className="mb-2 block font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#58413c]">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(event) => {
              setHasEditedName(true);
              setDisplayName(event.target.value);
            }}
            maxLength={40}
            className="mb-4 min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#fcf9f8] px-4 font-['Hanken_Grotesk',sans-serif] font-bold outline-none focus:ring-4 focus:ring-[#ff7551]"
            placeholder="Maya"
          />

          <button
            type="submit"
            disabled={isJoining}
            className="min-h-11 w-full rounded-lg border-2 border-[#1c1b1b] bg-[#ff7551] px-5 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isJoining ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              Join Room
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}
