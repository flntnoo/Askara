import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getOrCreateGuestUser } from '../../../../lib/auth';
import { getSessionHistory } from '../../../../services/session.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getOrCreateGuestUser(req);
    const sessions = await getSessionHistory(user.id);

    return successResponse(sessions);
  } catch (error) {
    return errorResponse(error);
  }
}
