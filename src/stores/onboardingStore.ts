'use client';

import { create } from 'zustand';
import {
  getOnboardingPreference,
  getOrCreateAnonymousUser,
  resetOnboarding as clearStoredOnboarding,
  saveOnboardingPreference,
} from '../utils/storage';
import { OnboardingPreference } from '../types';

type OnboardingStore = {
  preference: OnboardingPreference | null;
  savePreference: (preference: OnboardingPreference) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;
  refreshPreference: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  preference: null,
  savePreference: (preference) => {
    getOrCreateAnonymousUser();
    saveOnboardingPreference(preference);
    set({ preference });
  },
  resetOnboarding: () => {
    clearStoredOnboarding();
    set({ preference: null });
  },
  completeOnboarding: () => {
    const next = {
      ...(get().preference ?? {}),
      completedOnboarding: true,
    };
    saveOnboardingPreference(next);
    set({ preference: next });
  },
  refreshPreference: () => {
    set({ preference: getOnboardingPreference() });
  },
}));
