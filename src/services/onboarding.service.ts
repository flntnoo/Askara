import { prisma } from '../lib/prisma';
import type { OnboardingPreference } from '../types';

export async function getPreference(userId: string) {
  return prisma.onboardingPreference.findUnique({
    where: {
      userId,
    },
  });
}

export async function savePreference(userId: string, preference: OnboardingPreference) {
  return prisma.onboardingPreference.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      relationshipType: preference.relationshipType,
      relationshipStage: preference.relationshipStage,
      preferredTone: preference.preferredTone,
      completedOnboarding: preference.completedOnboarding,
    },
    update: {
      relationshipType: preference.relationshipType,
      relationshipStage: preference.relationshipStage,
      preferredTone: preference.preferredTone,
      completedOnboarding: preference.completedOnboarding,
    },
  });
}

export async function resetPreference(userId: string) {
  await prisma.onboardingPreference.deleteMany({
    where: {
      userId,
    },
  });

  return null;
}
