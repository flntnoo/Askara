import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../lib/auth';
import { getActiveSession } from '../../../../services/session.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const session = await getActiveSession(user.id);

    return successResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}
