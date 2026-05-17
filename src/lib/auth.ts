import { prisma } from './prisma';
import { ApiError } from './api-response';
import { auth } from '../../auth';

export function getAnonymousId(req: Request): string | null {
  return req.headers.get('x-anonymous-id');
}

export async function getCurrentUser(_req?: Request) {
  let session = null;

  try {
    session = await auth();
  } catch {
    return null;
  }

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
}

export async function getOrCreateGuestUser(req: Request) {
  const anonymousId = getAnonymousId(req);

  if (!anonymousId) {
    throw new ApiError(401, 'Missing x-anonymous-id header');
  }

  return prisma.user.upsert({
    where: { anonymousId },
    create: {
      anonymousId,
      provider: 'anonymous',
    },
    update: {
      provider: 'anonymous',
    },
  });
}

export async function getCurrentUserOrGuest(req: Request) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  return getOrCreateGuestUser(req);
}

export async function requireCurrentUser(req: Request) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  const anonymousId = getAnonymousId(req);

  if (anonymousId) {
    return getOrCreateGuestUser(req);
  }

  throw new ApiError(401, 'Authentication required');
}

export async function getOptionalGuestUser(req: Request) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  const anonymousId = getAnonymousId(req);

  if (!anonymousId) {
    return null;
  }

  return prisma.user.upsert({
    where: { anonymousId },
    create: {
      anonymousId,
      provider: 'anonymous',
    },
    update: {
      provider: 'anonymous',
    },
  });
}

export function assertAdminRequest(req: Request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new ApiError(503, 'Admin access is not configured');
  }

  const providedPassword = req.headers.get('x-admin-password');

  if (providedPassword !== expectedPassword) {
    throw new ApiError(401, 'Invalid admin credentials');
  }
}
