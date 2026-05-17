'use client';

import { create } from 'zustand';
import { getFavorites as readFavorites, resetFavorites as clearStoredFavorites, saveFavorites } from '../utils/storage';

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
    return favorites;
  },
  toggleFavorite: (cardId) => {
    const current = readFavorites();
    const next = current.includes(cardId)
      ? current.filter((id) => id !== cardId)
      : [...current, cardId];
    saveFavorites(next);
    set({ favorites: next });
  },
  removeFavorite: (cardId) => {
    const next = readFavorites().filter((id) => id !== cardId);
    saveFavorites(next);
    set({ favorites: next });
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
