'use client';

import { create } from 'zustand';
import { getFavorites as readFavorites, resetFavorites as clearStoredFavorites, saveFavorites } from '../utils/storage';
import { apiRequest } from '../lib/api-client';

type FavoriteStore = {
  favorites: string[];
  getFavorites: () => string[];
  toggleFavorite: (cardId: string) => void;
  removeFavorite: (cardId: string) => void;
  resetFavorites: () => void;
  isFavorite: (cardId: string) => boolean;
  refreshFavorites: () => void;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  getFavorites: () => {
    const favorites = readFavorites();
    set({ favorites });
    void apiRequest<{ cardIds: string[] }>('/api/favorites')
      .then((remoteFavorites) => {
        const mergedFavorites = Array.from(new Set([...favorites, ...remoteFavorites.cardIds]));
        saveFavorites(mergedFavorites);
        set({ favorites: mergedFavorites });
      })
      .catch((error) => {
        console.error('Failed to sync favorites:', error);
      });
    return favorites;
  },
  toggleFavorite: (cardId) => {
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
        saveFavorites(remoteFavorites.cardIds);
        set({ favorites: remoteFavorites.cardIds });
      })
      .catch((error) => {
        console.error('Failed to sync favorite toggle:', error);
      });
  },
  removeFavorite: (cardId) => {
    const next = readFavorites().filter((id) => id !== cardId);
    saveFavorites(next);
    set({ favorites: next });
    void apiRequest<{ cardIds: string[] }>(`/api/favorites?cardId=${encodeURIComponent(cardId)}`, {
      method: 'DELETE',
    })
      .then((remoteFavorites) => {
        saveFavorites(remoteFavorites.cardIds);
        set({ favorites: remoteFavorites.cardIds });
      })
      .catch((error) => {
        console.error('Failed to sync favorite removal:', error);
      });
  },
  resetFavorites: () => {
    clearStoredFavorites();
    set({ favorites: [] });
  },
  isFavorite: (cardId) => {
    const favorites = get().favorites.length > 0 ? get().favorites : readFavorites();
    return favorites.includes(cardId);
  },
  refreshFavorites: () => {
    set({ favorites: readFavorites() });
  },
}));
