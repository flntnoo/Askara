import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { prisma } from '../../lib/prisma';
import OnboardingPage from '../pages/OnboardingPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (session?.user?.id) {
    const preference = await prisma.onboardingPreference.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        completedOnboarding: true,
      },
    });

    if (preference?.completedOnboarding) {
      redirect('/home');
    }
  }

  return <OnboardingPage />;
}
