import { randomInt } from 'crypto';
import { getBoardCardBackImageSrc } from '../data/cardBackImages';
import { ApiError } from '../lib/api-response';
import { prisma } from '../lib/prisma';
import type { Deck, MultiplayerRoom } from '../types';
import { toConversationCard } from './card.service';

type RoomRecord = Awaited<ReturnType<typeof getRoomRecordOrThrow>>;

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_CODE_LENGTH = 6;
const WAITING_ROOM_TTL_MS = 60 * 60 * 1000;
const ACTIVE_ROOM_INACTIVITY_TTL_MS = 24 * 60 * 60 * 1000;

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

function getWaitingRoomExpiresAt(now = new Date()) {
  return new Date(now.getTime() + WAITING_ROOM_TTL_MS);
}

function getActiveRoomExpiresAt(now = new Date()) {
  return new Date(now.getTime() + ACTIVE_ROOM_INACTIVITY_TTL_MS);
}

function isPast(date: Date | null | undefined, now = new Date()) {
  return Boolean(date && date <= now);
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getActiveTurn(
  activePlayers: RoomRecord['players'],
  currentTurnPlayerId: string | null,
  turnIndex: number,
) {
  if (activePlayers.length === 0) {
    return null;
  }

  const currentIndex = activePlayers.findIndex((player) => player.id === currentTurnPlayerId);

  if (currentIndex >= 0) {
    return {
      index: currentIndex,
      player: activePlayers[currentIndex],
    };
  }

  const fallbackIndex = ((turnIndex % activePlayers.length) + activePlayers.length) %
    activePlayers.length;

  return {
    index: fallbackIndex,
    player: activePlayers[fallbackIndex],
  };
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

function serializeRoom(room: RoomRecord, viewerUserId?: string): MultiplayerRoom {
  const currentPlayer = viewerUserId
    ? room.players.find((player) => player.userId === viewerUserId && player.isActive)
    : undefined;
  const cards = room.roomCards.map((state) => ({
    id: state.id,
    roomId: state.roomId,
    cardId: state.cardId,
    position: state.position,
    isRevealed: state.isRevealed,
    revealedAt: state.revealedAt?.toISOString(),
    revealedByPlayerId: state.revealedByPlayerId ?? undefined,
    revealedByPlayerName: state.revealedByPlayer?.displayName,
    card: {
      ...toConversationCard(state.card),
      cardBackImageSrc: getBoardCardBackImageSrc(room.deckId, state.position),
    },
  }));

  const latestRevealedCard =
    [...cards]
      .filter((state) => state.isRevealed && state.revealedAt)
      .sort((a, b) => (b.revealedAt ?? '').localeCompare(a.revealedAt ?? ''))[0] ?? null;
  const activeTurn =
    room.status === 'active'
      ? getActiveTurn(
          room.players.filter((player) => player.isActive),
          room.currentTurnPlayerId,
          room.turnIndex,
        )
      : null;

  return {
    id: room.id,
    code: room.code,
    deckId: room.deckId,
    hostUserId: room.hostUserId ?? undefined,
    status: room.status as MultiplayerRoom['status'],
    currentTurnPlayerId: activeTurn?.player.id,
    turnIndex: room.turnIndex,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
    startedAt: room.startedAt?.toISOString(),
    endedAt: room.endedAt?.toISOString(),
    expiresAt: room.expiresAt?.toISOString(),
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
    currentPlayerId: currentPlayer?.id,
    currentPlayerRole: currentPlayer?.role as 'host' | 'player' | undefined,
    isCurrentUserHost: Boolean(
      currentPlayer?.role === 'host' || (viewerUserId && room.hostUserId === viewerUserId),
    ),
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

async function expireWaitingRoom(roomId: string, now = new Date()) {
  await prisma.multiplayerRoom.updateMany({
    where: {
      id: roomId,
      status: 'waiting',
    },
    data: {
      status: 'expired',
      endedAt: now,
    },
  });
}

async function abandonActiveRoom(roomId: string, now = new Date()) {
  await prisma.multiplayerRoom.updateMany({
    where: {
      id: roomId,
      status: 'active',
    },
    data: {
      status: 'abandoned',
      endedAt: now,
      currentTurnPlayerId: null,
    },
  });
}

async function rejectIfWaitingRoomExpired(room: RoomRecord, now = new Date()) {
  if (room.status === 'waiting' && isPast(room.expiresAt, now)) {
    await expireWaitingRoom(room.id, now);
    throw new ApiError(410, 'Room has expired');
  }
}

async function rejectIfActiveRoomInactive(room: RoomRecord, now = new Date()) {
  if (room.status === 'active' && isPast(room.expiresAt, now)) {
    await abandonActiveRoom(room.id, now);
    throw new ApiError(410, 'Room has been abandoned after inactivity');
  }
}

export async function createMultiplayerRoom(userId: string, deckId: string, displayName?: string) {
  const trimmedDisplayName = displayName?.trim();

  if (!trimmedDisplayName) {
    throw new ApiError(400, 'Display name is required');
  }

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
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const room = await tx.multiplayerRoom.create({
      data: {
        code,
        deckId,
        hostUserId: userId,
        status: 'waiting',
        expiresAt: getWaitingRoomExpiresAt(now),
      },
    });

    await tx.roomPlayer.create({
      data: {
        roomId: room.id,
        userId,
        displayName: trimmedDisplayName,
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
  });

  return getMultiplayerRoom(code, userId);
}

export async function joinMultiplayerRoom(code: string, userId: string, displayName?: string) {
  const normalizedCode = normalizeRoomCode(code);
  const trimmedDisplayName = displayName?.trim();

  if (!trimmedDisplayName) {
    throw new ApiError(400, 'Display name is required');
  }

  const room = await getRoomRecordOrThrow(normalizedCode);

  if (room.status !== 'waiting') {
    throw new ApiError(
      409,
      room.status === 'active' ? 'Game already started' : 'Room cannot be joined',
    );
  }

  await rejectIfWaitingRoomExpired(room);

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
        displayName: trimmedDisplayName,
      },
    });

    return getMultiplayerRoom(normalizedCode, userId);
  }

  const nextPosition =
    room.players.reduce((highest, player) => Math.max(highest, player.position), -1) + 1;

  await prisma.roomPlayer.create({
    data: {
      roomId: room.id,
      userId,
      displayName: trimmedDisplayName,
      role: 'player',
      position: nextPosition,
    },
  });

  return getMultiplayerRoom(normalizedCode, userId);
}

export async function getMultiplayerRoom(code: string, viewerUserId?: string) {
  const room = await getRoomRecordOrThrow(code);
  return serializeRoom(room, viewerUserId);
}

export async function startMultiplayerRoom(code: string, userId: string) {
  const room = await getRoomRecordOrThrow(code);
  const player = await getPlayerForUser(room.id, userId);

  if (!player) {
    throw new ApiError(403, 'Join the room before starting it');
  }

  if (room.hostUserId !== userId && player.role !== 'host') {
    throw new ApiError(403, 'Only the host can start this room');
  }

  if (room.status !== 'waiting') {
    throw new ApiError(
      409,
      room.status === 'active' ? 'Game already started' : 'Room cannot be started',
    );
  }

  const now = new Date();
  await rejectIfWaitingRoomExpired(room, now);

  const activePlayers = room.players.filter((item) => item.isActive);

  if (activePlayers.length < 2) {
    throw new ApiError(409, 'At least 2 active players are required to start');
  }

  const firstPlayer = activePlayers.find((item) => item.role === 'host') ?? activePlayers[0];
  const turnIndex = Math.max(
    0,
    activePlayers.findIndex((item) => item.id === firstPlayer.id),
  );

  await prisma.multiplayerRoom.update({
    where: {
      id: room.id,
    },
    data: {
      status: 'active',
      startedAt: now,
      expiresAt: getActiveRoomExpiresAt(now),
      currentTurnPlayerId: firstPlayer.id,
      turnIndex,
    },
  });

  return getMultiplayerRoom(room.code, userId);
}

export async function revealRoomCard(code: string, userId: string, roomCardId: string) {
  const room = await getRoomRecordOrThrow(code);

  if (room.status !== 'active') {
    throw new ApiError(400, 'Room is not active');
  }

  const now = new Date();
  await rejectIfActiveRoomInactive(room, now);

  const player = await getPlayerForUser(room.id, userId);

  if (!player) {
    throw new ApiError(403, 'Join the room before revealing cards');
  }

  const activePlayers = room.players.filter((item) => item.isActive);
  const activeTurn = getActiveTurn(activePlayers, room.currentTurnPlayerId, room.turnIndex);

  if (!activeTurn) {
    throw new ApiError(409, 'Room has no active players');
  }

  if (activeTurn.player.id !== player.id) {
    throw new ApiError(409, 'It is not your turn');
  }

  const roomCard = room.roomCards.find((state) => state.id === roomCardId);

  if (!roomCard) {
    throw new ApiError(404, 'Card not found for this room');
  }

  const nextTurnIndex = (activeTurn.index + 1) % activePlayers.length;
  const nextTurnPlayer = activePlayers[nextTurnIndex];

  await prisma.$transaction(async (tx) => {
    const cardUpdate = await tx.roomCard.updateMany({
      where: {
        id: roomCard.id,
        roomId: room.id,
        isRevealed: false,
      },
      data: {
        isRevealed: true,
        revealedAt: now,
        revealedByPlayerId: player.id,
      },
    });

    if (cardUpdate.count === 0) {
      throw new ApiError(409, 'Card is already revealed');
    }

    const roomUpdate = await tx.multiplayerRoom.updateMany({
      where: {
        id: room.id,
        status: 'active',
        currentTurnPlayerId: room.currentTurnPlayerId,
      },
      data: {
        turnIndex: nextTurnIndex,
        currentTurnPlayerId: nextTurnPlayer.id,
        expiresAt: getActiveRoomExpiresAt(now),
      },
    });

    if (roomUpdate.count === 0) {
      throw new ApiError(409, 'Turn already changed. Refresh and try again.');
    }
  });

  return getMultiplayerRoom(room.code, userId);
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
      endedAt: new Date(),
      expiresAt: null,
      currentTurnPlayerId: null,
    },
  });

  return getMultiplayerRoom(room.code, userId);
}
