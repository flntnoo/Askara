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
import { apiRequest } from '../lib/api-client';

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
  createSession: (deckId: string) => Promise<CardSession>;
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
  const createLocalSession = (deckId: string): CardSession => {
    const now = new Date().toISOString();
    return {
      id: createSessionId(),
      deckId,
      mode: 'solo',
      status: 'active',
      startedAt: now,
      currentCardId: undefined,
      viewedCardIds: [],
      skippedCardIds: [],
      favoriteCardIds: [],
      logs: [],
    };
  };

  const persistActive = (session: CardSession) => {
    saveActiveSession(session);
    set({ activeSession: session });
  };

  const syncAction = (sessionId: string, cardId: string, action: CardAction) => {
    void apiRequest<CardSession>(`/api/sessions/${sessionId}/actions`, {
      method: 'POST',
      body: JSON.stringify({ cardId, action }),
    })
      .then((session) => {
        if (get().activeSession?.id === session.id) {
          persistActive(session);
        }
      })
      .catch((error) => {
        console.error('Failed to sync session action:', error);
      });
  };

  const syncSessionPatch = (session: CardSession) => {
    void apiRequest<CardSession>(`/api/sessions/${session.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: session.status,
        currentCardId: session.currentCardId ?? null,
        endedAt: session.endedAt ?? null,
      }),
    }).catch((error) => {
      console.error('Failed to sync session:', error);
    });
  };

  const updateSession = (updater: (session: CardSession) => CardSession) => {
    const current = get().activeSession ?? getActiveSession();
    if (!current) return;
    persistActive(updater(current));
  };

  return {
    activeSession: null,
    createSession: async (deckId) => {
      try {
        const session = await apiRequest<CardSession>('/api/sessions', {
          method: 'POST',
          body: JSON.stringify({ deckId }),
        });
        persistActive(session);
        return session;
      } catch (error) {
        console.error('Failed to create remote session, using local session:', error);
        const session = createLocalSession(deckId);
        persistActive(session);
        return session;
      }
    },
    restoreSession: (sessionId) => {
      const active = getActiveSession();
      const session = active?.id === sessionId ? active : getSession(sessionId);
      set({ activeSession: session?.status === 'active' ? session : null });
      return session;
    },
    setCurrentCard: (cardId) => {
      const sessionId = (get().activeSession ?? getActiveSession())?.id;
      updateSession((session) => ({
        ...session,
        currentCardId: cardId,
      }));
      const session = get().activeSession;
      if (sessionId && session?.id === sessionId) {
        syncSessionPatch(session);
      }
    },
    markViewed: (cardId) => {
      const sessionId = (get().activeSession ?? getActiveSession())?.id;
      updateSession((session) => ({
        ...session,
        viewedCardIds: unique([...session.viewedCardIds, cardId]),
        logs: [
          ...session.logs,
          { cardId, action: 'viewed', shownAt: new Date().toISOString() },
        ],
      }));
      if (sessionId) {
        syncAction(sessionId, cardId, 'viewed');
      }
    },
    markSkipped: (cardId) => {
      const sessionId = (get().activeSession ?? getActiveSession())?.id;
      updateSession((session) => ({
        ...session,
        skippedCardIds: unique([...session.skippedCardIds, cardId]),
        logs: [
          ...session.logs,
          { cardId, action: 'skipped', shownAt: new Date().toISOString() },
        ],
      }));
      if (sessionId) {
        syncAction(sessionId, cardId, 'skipped');
      }
    },
    toggleFavoriteInSession: (cardId) => {
      const sessionId = (get().activeSession ?? getActiveSession())?.id;
      let action: CardAction = 'favorited';
      updateSession((session) => {
        const isFavorite = session.favoriteCardIds.includes(cardId);
        action = isFavorite ? 'unfavorited' : 'favorited';
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
              action,
              shownAt: new Date().toISOString(),
            },
          ],
        };
      });
      if (sessionId) {
        syncAction(sessionId, cardId, action);
      }
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
      syncSessionPatch(completed);
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
      syncSessionPatch(abandoned);
    },
    refreshActiveSession: () => {
      set({ activeSession: getActiveSession() });
    },
  };
});
