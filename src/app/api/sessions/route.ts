import { errorResponse, successResponse } from '../../../lib/api-response';
import { getOrCreateGuestUser } from '../../../lib/auth';
import { createSessionSchema } from '../../../lib/validators';
import { createSession } from '../../../services/session.service';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getOrCreateGuestUser(req);
    const body = createSessionSchema.parse(await req.json());
    const session = await createSession(user.id, body.deckId);

    return successResponse(session, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
