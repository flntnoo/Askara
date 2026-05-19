'use client';

import { create } from 'zustand';
import { getFavorites as readFavorites, resetFavorites as clearStoredFavorites, saveFavorites } from '../utils/storage';
import { apiRequest } from '../lib/api-client';

let favoriteSyncVersion = 0;

type FavoriteStore = {
  favorites: string[];
  getFavorites: () => string[];
  hydrateFavorites: () => Promise<string[]>;
  toggleFavorite: (cardId: string) => void;
  removeFavorite: (cardId: string) => void;
  clearFavorites: () => Promise<void>;
  resetFavorites: () => void;
  isFavorite: (cardId: string) => boolean;
  refreshFavorites: () => void;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  getFavorites: () => {
    const favorites = readFavorites();
    set({ favorites });
    void get().hydrateFavorites();
    return favorites;
  },
  hydrateFavorites: async () => {
    const syncVersion = ++favoriteSyncVersion;
    const favorites = readFavorites();
    set({ favorites });

    try {
      const remoteFavorites = await apiRequest<{ cardIds: string[] }>('/api/favorites');

      if (syncVersion !== favoriteSyncVersion) {
        return get().favorites;
      }

      saveFavorites(remoteFavorites.cardIds);
      set({ favorites: remoteFavorites.cardIds });
      return remoteFavorites.cardIds;
    } catch (error) {
      console.error('Failed to sync favorites:', error);
      return favorites;
    }
  },
  toggleFavorite: (cardId) => {
    const syncVersion = ++favoriteSyncVersion;
    const current = readFavorites();
    const isFavorite = current.includes(cardId);
    const next = isFavorite ? current.filter((id) => id !== cardId) : [...current, cardId];
    saveFavorites(next);
    set({ favorites: next });
    const request = isFavorite
      ? apiRequest<{ cardIds: string[] }>(`/api/favorites?cardId=${encodeURIComponent(cardId)}`, {
          method: 'DELETE',
        })
      : apiRequest<{ cardIds: string[] }>('/api/favorites', {
          method: 'POST',
          body: JSON.stringify({ cardId }),
        });

    void request
      .then((remoteFavorites) => {
        if (syncVersion !== favoriteSyncVersion) return;

        saveFavorites(remoteFavorites.cardIds);
        set({ favorites: remoteFavorites.cardIds });
      })
      .catch((error) => {
        console.error('Failed to sync favorite toggle:', error);
      });
  },
  removeFavorite: (cardId) => {
    const syncVersion = ++favoriteSyncVersion;
    const current = readFavorites();
    const next = current.filter((id) => id !== cardId);
    saveFavorites(next);
    set({ favorites: next });
    void apiRequest<{ cardIds: string[] }>(`/api/favorites?cardId=${encodeURIComponent(cardId)}`, {
      method: 'DELETE',
    })
      .then((remoteFavorites) => {
        if (syncVersion !== favoriteSyncVersion) return;

        saveFavorites(remoteFavorites.cardIds);
        set({ favorites: remoteFavorites.cardIds });
      })
      .catch((error) => {
        console.error('Failed to sync favorite removal:', error);
      });
  },
  clearFavorites: async () => {
    const syncVersion = ++favoriteSyncVersion;
    clearStoredFavorites();
    set({ favorites: [] });

    const remoteFavorites = await apiRequest<{ cardIds: string[] }>('/api/favorites', {
      method: 'DELETE',
    });

    if (syncVersion !== favoriteSyncVersion) return;

    saveFavorites(remoteFavorites.cardIds);
    set({ favorites: remoteFavorites.cardIds });
  },
  resetFavorites: () => {
    void get().clearFavorites().catch((error) => {
      console.error('Failed to clear favorites:', error);
    });
  },
  isFavorite: (cardId) => {
    const favorites = get().favorites.length > 0 ? get().favorites : readFavorites();
    return favorites.includes(cardId);
  },
  refreshFavorites: () => {
    void get().hydrateFavorites();
  },
}));
