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
    void apiRequest<OnboardingPreference>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(preference),
    })
      .then((remotePreference) => {
        saveOnboardingPreference(remotePreference);
        set({ preference: remotePreference });
      })
      .catch((error) => {
        console.error('Failed to sync onboarding preference:', error);
      });
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
    void apiRequest<OnboardingPreference>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(next),
    })
      .then((remotePreference) => {
        saveOnboardingPreference(remotePreference);
        set({ preference: remotePreference });
      })
      .catch((error) => {
        console.error('Failed to sync onboarding completion:', error);
      });
  },
  refreshPreference: () => {
    const localPreference = getOnboardingPreference();
    set({ preference: localPreference });
    void apiRequest<OnboardingPreference | null>('/api/onboarding')
      .then((remotePreference) => {
        if (remotePreference) {
          saveOnboardingPreference(remotePreference);
          set({ preference: remotePreference });
          return;
        }
        set({ preference: localPreference });
      })
      .catch((error) => {
        console.error('Failed to sync onboarding preference:', error);
      });
  },
}));
