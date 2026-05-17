import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../lib/auth';
import { getSessionHistory } from '../../../../services/session.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const sessions = await getSessionHistory(user.id);

    return successResponse(sessions);
  } catch (error) {
    return errorResponse(error);
  }
}
