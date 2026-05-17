import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../lib/auth';
import { getTableSession } from '../../../../services/table-session.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const { sessionId } = await context.params;
    const session = await getTableSession(sessionId, user.id);

    return successResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}
