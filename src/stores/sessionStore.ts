'use client';

import { create } from 'zustand';
import {
  appendSessionHistory,
  clearActiveSession,
  getActiveSession,
  getFavorites,
  getSession,
  saveActiveSession,
  saveFavorites,
} from '../utils/storage';
import { CardAction, CardSession } from '../types';

const createSessionId = () => {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);
  return `session_${randomPart}`;
};

const unique = (values: string[]) => Array.from(new Set(values));

type SessionStore = {
  activeSession: CardSession | null;
  createSession: (deckId: string) => CardSession;
  restoreSession: (sessionId: string) => CardSession | null;
  setCurrentCard: (cardId: string) => void;
  markViewed: (cardId: string) => void;
  markSkipped: (cardId: string) => void;
  toggleFavoriteInSession: (cardId: string) => void;
  logCardAction: (cardId: string, action: CardAction) => void;
  endSession: () => void;
  abandonSession: () => void;
  refreshActiveSession: () => void;
};

export const useSessionStore = create<SessionStore>((set, get) => {
  const persistActive = (session: CardSession) => {
    saveActiveSession(session);
    set({ activeSession: session });
  };

  const updateSession = (updater: (session: CardSession) => CardSession) => {
    const current = get().activeSession ?? getActiveSession();
    if (!current) return;
    persistActive(updater(current));
  };

  return {
    activeSession: null,
    createSession: (deckId) => {
      const now = new Date().toISOString();
      const session: CardSession = {
        id: createSessionId(),
        deckId,
        status: 'active',
        startedAt: now,
        currentCardId: undefined,
        viewedCardIds: [],
        skippedCardIds: [],
        favoriteCardIds: [],
        logs: [],
      };
      persistActive(session);
      return session;
    },
    restoreSession: (sessionId) => {
      const active = getActiveSession();
      const session = active?.id === sessionId ? active : getSession(sessionId);
      set({ activeSession: session?.status === 'active' ? session : null });
      return session;
    },
    setCurrentCard: (cardId) => {
      updateSession((session) => ({
        ...session,
        currentCardId: cardId,
      }));
    },
    markViewed: (cardId) => {
      updateSession((session) => ({
        ...session,
        viewedCardIds: unique([...session.viewedCardIds, cardId]),
        logs: [
          ...session.logs,
          { cardId, action: 'viewed', shownAt: new Date().toISOString() },
        ],
      }));
    },
    markSkipped: (cardId) => {
      updateSession((session) => ({
        ...session,
        skippedCardIds: unique([...session.skippedCardIds, cardId]),
        logs: [
          ...session.logs,
          { cardId, action: 'skipped', shownAt: new Date().toISOString() },
        ],
      }));
    },
    toggleFavoriteInSession: (cardId) => {
      updateSession((session) => {
        const isFavorite = session.favoriteCardIds.includes(cardId);
        const nextSessionFavorites = isFavorite
          ? session.favoriteCardIds.filter((id) => id !== cardId)
          : unique([...session.favoriteCardIds, cardId]);
        const currentGlobalFavorites = getFavorites();
        const nextGlobalFavorites = isFavorite
          ? currentGlobalFavorites.filter((id) => id !== cardId)
          : unique([...currentGlobalFavorites, cardId]);
        saveFavorites(nextGlobalFavorites);

        return {
          ...session,
          favoriteCardIds: nextSessionFavorites,
          logs: [
            ...session.logs,
            {
              cardId,
              action: isFavorite ? 'unfavorited' : 'favorited',
              shownAt: new Date().toISOString(),
            },
          ],
        };
      });
    },
    logCardAction: (cardId, action) => {
      updateSession((session) => ({
        ...session,
        logs: [...session.logs, { cardId, action, shownAt: new Date().toISOString() }],
      }));
    },
    endSession: () => {
      const current = get().activeSession ?? getActiveSession();
      if (!current) return;
      const completed: CardSession = {
        ...current,
        status: 'completed',
        endedAt: new Date().toISOString(),
      };
      appendSessionHistory(completed);
      clearActiveSession();
      set({ activeSession: null });
    },
    abandonSession: () => {
      const current = get().activeSession ?? getActiveSession();
      if (!current) return;
      const abandoned: CardSession = {
        ...current,
        status: 'abandoned',
        endedAt: new Date().toISOString(),
      };
      appendSessionHistory(abandoned);
      clearActiveSession();
      set({ activeSession: null });
    },
    refreshActiveSession: () => {
      set({ activeSession: getActiveSession() });
    },
  };
});
