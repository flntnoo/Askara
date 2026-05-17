import { prisma } from '../lib/prisma';

export async function linkAnonymousUserToOAuthUser(anonymousId: string, oauthUserId: string) {
  const guestUser = await prisma.user.findUnique({
    where: {
      anonymousId,
    },
    include: {
      onboarding: true,
      favorites: {
        select: {
          cardId: true,
        },
      },
    },
  });

  if (!guestUser || guestUser.id === oauthUserId) {
    return {
      linked: false,
      reason: 'No separate anonymous user to link',
    };
  }

  const oauthOnboarding = await prisma.onboardingPreference.findUnique({
    where: {
      userId: oauthUserId,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (guestUser.favorites.length > 0) {
      await tx.favorite.createMany({
        data: guestUser.favorites.map((favorite) => ({
          userId: oauthUserId,
          cardId: favorite.cardId,
        })),
        skipDuplicates: true,
      });

      await tx.favorite.deleteMany({
        where: {
          userId: guestUser.id,
        },
      });
    }

    if (guestUser.onboarding) {
      if (!oauthOnboarding) {
        await tx.onboardingPreference.update({
          where: {
            userId: guestUser.id,
          },
          data: {
            userId: oauthUserId,
          },
        });
      } else {
        await tx.onboardingPreference.delete({
          where: {
            userId: guestUser.id,
          },
        });
      }
    }

    await tx.cardSession.updateMany({
      where: {
        userId: guestUser.id,
      },
      data: {
        userId: oauthUserId,
      },
    });

    await tx.analyticsEvent.updateMany({
      where: {
        userId: guestUser.id,
      },
      data: {
        userId: oauthUserId,
      },
    });
  });

  return {
    linked: true,
    guestUserId: guestUser.id,
    oauthUserId,
    favoritesMerged: guestUser.favorites.length,
    onboardingMerged: Boolean(guestUser.onboarding && !oauthOnboarding),
  };
}
