import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getOrCreateGuestUser } from '../../../../lib/auth';
import { getActiveSession } from '../../../../services/session.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getOrCreateGuestUser(req);
    const session = await getActiveSession(user.id);

    return successResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}
