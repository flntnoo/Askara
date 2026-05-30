import type { Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

type AnalyticsEventInput = {
  name: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
};

export async function logAnalyticsEvents(userId: string | null, events: AnalyticsEventInput[]) {
  await prisma.analyticsEvent.createMany({
    data: events.map((event) => ({
      userId,
      name: event.name,
      payload: (event.payload ?? {}) as Prisma.InputJsonValue,
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
    })),
  });

  return {
    count: events.length,
  };
}
