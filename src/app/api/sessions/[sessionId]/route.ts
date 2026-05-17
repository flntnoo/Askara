import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../lib/auth';
import { updateSessionSchema } from '../../../../lib/validators';
import { getSession, updateSession } from '../../../../services/session.service';

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
    const session = await getSession(sessionId, user.id);

    return successResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const { sessionId } = await context.params;
    const body = updateSessionSchema.parse(await req.json());
    const session = await updateSession(sessionId, user.id, body);

    return successResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}
