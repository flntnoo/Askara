import { NextRequest } from 'next/server';
import { ApiError, errorResponse, successResponse } from '../../../../lib/api-response';
import { getCurrentUser } from '../../../../lib/auth';
import { linkAnonymousUserToOAuthUser } from '../../../../services/auth-link.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      throw new ApiError(401, 'Google sign-in is required before linking guest data');
    }
    const anonymousId =
      req.headers.get('x-anonymous-id') ?? req.cookies.get('dcc_anonymous_id')?.value ?? null;

    if (!anonymousId) {
      throw new ApiError(400, 'Missing anonymous ID to link');
    }

    const result = await linkAnonymousUserToOAuthUser(anonymousId, user.id);

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
