'use client';

import { create } from 'zustand';
import {
  getOnboardingPreference,
  getOrCreateAnonymousUser,
  resetOnboarding as clearStoredOnboarding,
  saveOnboardingPreference,
} from '../utils/storage';
import { OnboardingPreference } from '../types';
import { apiRequest } from '../lib/api-client';

let onboardingSyncVersion = 0;

type OnboardingStore = {
  preference: OnboardingPreference | null;
  savePreference: (preference: OnboardingPreference) => void;
  resetOnboarding: () => Promise<void>;
  hydrateOnboarding: () => Promise<OnboardingPreference | null>;
  completeOnboarding: () => void;
  refreshPreference: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  preference: null,
  savePreference: (preference) => {
    const syncVersion = ++onboardingSyncVersion;
    getOrCreateAnonymousUser();
    saveOnboardingPreference(preference);
    set({ preference });
    void apiRequest<OnboardingPreference>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(preference),
    })
      .then((remotePreference) => {
        if (syncVersion !== onboardingSyncVersion) return;

        saveOnboardingPreference(remotePreference);
        set({ preference: remotePreference });
      })
      .catch((error) => {
        console.error('Failed to sync onboarding preference:', error);
      });
  },
  resetOnboarding: async () => {
    const syncVersion = ++onboardingSyncVersion;
    clearStoredOnboarding();
    set({ preference: null });

    await apiRequest<null>('/api/onboarding', {
      method: 'DELETE',
    });

    if (syncVersion !== onboardingSyncVersion) return;

    clearStoredOnboarding();
    set({ preference: null });
  },
  completeOnboarding: () => {
    const syncVersion = ++onboardingSyncVersion;
    const next = {
      ...(get().preference ?? {}),
      completedOnboarding: true,
    };
    saveOnboardingPreference(next);
    set({ preference: next });
    void apiRequest<OnboardingPreference>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(next),
    })
      .then((remotePreference) => {
        if (syncVersion !== onboardingSyncVersion) return;

        saveOnboardingPreference(remotePreference);
        set({ preference: remotePreference });
      })
      .catch((error) => {
        console.error('Failed to sync onboarding completion:', error);
      });
  },
  hydrateOnboarding: async () => {
    const syncVersion = ++onboardingSyncVersion;
    const localPreference = getOnboardingPreference();
    set({ preference: localPreference });

    try {
      const remotePreference = await apiRequest<OnboardingPreference | null>('/api/onboarding');

      if (syncVersion !== onboardingSyncVersion) {
        return get().preference;
      }

      if (remotePreference) {
        saveOnboardingPreference(remotePreference);
        set({ preference: remotePreference });
        return remotePreference;
      }

      clearStoredOnboarding();
      set({ preference: null });
      return null;
    } catch (error) {
      console.error('Failed to sync onboarding preference:', error);
      return localPreference;
    }
  },
  refreshPreference: () => {
    void get().hydrateOnboarding();
  },
}));
