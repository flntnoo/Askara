import { randomInt } from 'crypto';
import { ApiError } from '../lib/api-response';
import { prisma } from '../lib/prisma';
import type { Deck, MultiplayerRoom } from '../types';
import { toConversationCard } from './card.service';

type RoomRecord = Awaited<ReturnType<typeof getRoomRecordOrThrow>>;

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_CODE_LENGTH = 6;

function serializeDeck(deck: RoomRecord['deck']): Deck {
  return {
    id: deck.id,
    slug: deck.slug,
    name: deck.name,
    title: deck.title ?? undefined,
    description: deck.description,
    shortDescription: deck.shortDescription ?? undefined,
    category: deck.category as Deck['category'],
    cardCount: deck.cardCount,
    estimatedMinutes: deck.estimatedMinutes,
    estimatedDuration: deck.estimatedDuration ?? undefined,
    suitableFor: deck.suitableFor,
    topics: deck.topics,
    isPremium: deck.isPremium,
    isRecommended: deck.isRecommended,
    colorVariant: deck.colorVariant as Deck['colorVariant'],
    color: deck.color ?? undefined,
    icon: deck.icon ?? undefined,
    coverIllustration: deck.coverIllustration ?? undefined,
    sortOrder: deck.sortOrder,
  };
}

function generateRoomCode() {
  return Array.from({ length: ROOM_CODE_LENGTH }, () => {
    return ROOM_CODE_ALPHABET[randomInt(ROOM_CODE_ALPHABET.length)];
  }).join('');
}

function normalizeRoomCode(code: string) {
  return code.trim().toUpperCase();
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

async function createUniqueRoomCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateRoomCode();
    const existing = await prisma.multiplayerRoom.findUnique({
      where: { code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }
  }

  throw new ApiError(503, 'Unable to generate a room code');
}

async function getRoomRecordOrThrow(code: string) {
  const room = await prisma.multiplayerRoom.findUnique({
    where: {
      code: normalizeRoomCode(code),
    },
    include: {
      deck: true,
      players: {
        orderBy: {
          position: 'asc',
        },
      },
      currentTurnPlayer: true,
      roomCards: {
        orderBy: {
          position: 'asc',
        },
        include: {
          card: true,
          revealedByPlayer: true,
        },
      },
    },
  });

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  return room;
}

function serializeRoom(room: RoomRecord): MultiplayerRoom {
  const cards = room.roomCards.map((state) => ({
    id: state.id,
    roomId: state.roomId,
    cardId: state.cardId,
    position: state.position,
    isRevealed: state.isRevealed,
    revealedAt: state.revealedAt?.toISOString(),
    revealedByPlayerId: state.revealedByPlayerId ?? undefined,
    revealedByPlayerName: state.revealedByPlayer?.displayName,
    card: toConversationCard(state.card),
  }));

  const latestRevealedCard =
    [...cards]
      .filter((state) => state.isRevealed && state.revealedAt)
      .sort((a, b) => (b.revealedAt ?? '').localeCompare(a.revealedAt ?? ''))[0] ?? null;

  return {
    id: room.id,
    code: room.code,
    deckId: room.deckId,
    hostUserId: room.hostUserId ?? undefined,
    status: room.status as MultiplayerRoom['status'],
    currentTurnPlayerId: room.currentTurnPlayerId ?? undefined,
    turnIndex: room.turnIndex,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
    deck: serializeDeck(room.deck),
    players: room.players.map((player) => ({
      id: player.id,
      roomId: player.roomId,
      userId: player.userId ?? undefined,
      displayName: player.displayName,
      role: player.role as 'host' | 'player',
      position: player.position,
      isActive: player.isActive,
      joinedAt: player.joinedAt.toISOString(),
    })),
    cards,
    latestRevealedCard,
  };
}

async function getPlayerForUser(roomId: string, userId: string) {
  return prisma.roomPlayer.findFirst({
    where: {
      roomId,
      userId,
      isActive: true,
    },
  });
}

export async function createMultiplayerRoom(userId: string, deckId: string, displayName?: string) {
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      isActive: true,
    },
    include: {
      cards: {
        where: {
          isActive: true,
        },
      },
    },
  });

  if (!deck) {
    throw new ApiError(404, 'Deck not found');
  }

  if (deck.cards.length === 0) {
    throw new ApiError(409, 'Deck has no playable cards');
  }

  const code = await createUniqueRoomCode();
  const shuffledCards = shuffle(deck.cards);

  await prisma.$transaction(async (tx) => {
    const room = await tx.multiplayerRoom.create({
      data: {
        code,
        deckId,
        hostUserId: userId,
        status: 'active',
      },
    });

    const hostPlayer = await tx.roomPlayer.create({
      data: {
        roomId: room.id,
        userId,
        displayName: displayName?.trim() || 'Host',
        role: 'host',
        position: 0,
      },
    });

    await tx.roomCard.createMany({
      data: shuffledCards.map((card, position) => ({
        roomId: room.id,
        cardId: card.id,
        position,
      })),
    });

    await tx.multiplayerRoom.update({
      where: {
        id: room.id,
      },
      data: {
        currentTurnPlayerId: hostPlayer.id,
      },
    });
  });

  return getMultiplayerRoom(code);
}

export async function joinMultiplayerRoom(code: string, userId: string, displayName?: string) {
  const normalizedCode = normalizeRoomCode(code);
  const room = await getRoomRecordOrThrow(normalizedCode);

  if (room.status === 'completed') {
    throw new ApiError(409, 'Room has already ended');
  }

  const existingPlayer = await prisma.roomPlayer.findFirst({
    where: {
      roomId: room.id,
      userId,
    },
  });

  if (existingPlayer) {
    await prisma.roomPlayer.update({
      where: {
        id: existingPlayer.id,
      },
      data: {
        isActive: true,
        ...(displayName?.trim() ? { displayName: displayName.trim() } : {}),
      },
    });

    return getMultiplayerRoom(normalizedCode);
  }

  const nextPosition =
    room.players.reduce((highest, player) => Math.max(highest, player.position), -1) + 1;

  await prisma.roomPlayer.create({
    data: {
      roomId: room.id,
      userId,
      displayName: displayName?.trim() || `Player ${nextPosition + 1}`,
      role: 'player',
      position: nextPosition,
    },
  });

  return getMultiplayerRoom(normalizedCode);
}

export async function getMultiplayerRoom(code: string) {
  const room = await getRoomRecordOrThrow(code);
  return serializeRoom(room);
}

export async function revealRoomCard(code: string, userId: string, roomCardId: string) {
  const room = await getRoomRecordOrThrow(code);

  if (room.status !== 'active') {
    throw new ApiError(409, 'Room is not active');
  }

  const player = await getPlayerForUser(room.id, userId);

  if (!player) {
    throw new ApiError(403, 'Join the room before revealing cards');
  }

  const activePlayers = room.players.filter((item) => item.isActive);

  if (
    activePlayers.length > 1 &&
    room.currentTurnPlayerId &&
    room.currentTurnPlayerId !== player.id
  ) {
    throw new ApiError(409, 'It is not your turn');
  }

  const roomCard = room.roomCards.find((state) => state.id === roomCardId);

  if (!roomCard) {
    throw new ApiError(404, 'Card not found for this room');
  }

  const updateResult = await prisma.roomCard.updateMany({
    where: {
      id: roomCard.id,
      isRevealed: false,
    },
    data: {
      isRevealed: true,
      revealedAt: new Date(),
      revealedByPlayerId: player.id,
    },
  });

  if (updateResult.count === 0) {
    throw new ApiError(409, 'Card is already revealed');
  }

  return getMultiplayerRoom(room.code);
}

export async function moveRoomToNextTurn(code: string, userId: string) {
  const room = await getRoomRecordOrThrow(code);
  const player = await getPlayerForUser(room.id, userId);

  if (!player) {
    throw new ApiError(403, 'Join the room before changing turns');
  }

  if (room.status !== 'active') {
    throw new ApiError(409, 'Room is not active');
  }

  const activePlayers = room.players.filter((item) => item.isActive);

  if (activePlayers.length === 0) {
    throw new ApiError(409, 'Room has no active players');
  }

  const nextIndex = (room.turnIndex + 1) % activePlayers.length;
  const nextPlayer = activePlayers[nextIndex];

  await prisma.multiplayerRoom.update({
    where: {
      id: room.id,
    },
    data: {
      turnIndex: nextIndex,
      currentTurnPlayerId: nextPlayer.id,
    },
  });

  return getMultiplayerRoom(room.code);
}

export async function endMultiplayerRoom(code: string, userId: string) {
  const room = await getRoomRecordOrThrow(code);
  const player = await getPlayerForUser(room.id, userId);

  if (!player) {
    throw new ApiError(403, 'Join the room before ending it');
  }

  if (room.hostUserId !== userId && player.role !== 'host') {
    throw new ApiError(403, 'Only the host can end this room');
  }

  await prisma.multiplayerRoom.update({
    where: {
      id: room.id,
    },
    data: {
      status: 'completed',
    },
  });

  return getMultiplayerRoom(room.code);
}
