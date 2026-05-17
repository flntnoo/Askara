import { errorResponse, successResponse } from '../../../../../lib/api-response';
import { getOrCreateGuestUser } from '../../../../../lib/auth';
import { sessionActionSchema } from '../../../../../lib/validators';
import { logSessionAction } from '../../../../../services/session.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const user = await getOrCreateGuestUser(req);
    const { sessionId } = await context.params;
    const body = sessionActionSchema.parse(await req.json());
    const session = await logSessionAction(sessionId, user.id, body);

    return successResponse(session, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
