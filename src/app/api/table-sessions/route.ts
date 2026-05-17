import { errorResponse, successResponse } from '../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../lib/auth';
import { createTableSessionSchema } from '../../../lib/validators';
import { createTableSession } from '../../../services/table-session.service';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const body = createTableSessionSchema.parse(await req.json());
    const session = await createTableSession(user.id, body.deckId);

    return successResponse(session, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
