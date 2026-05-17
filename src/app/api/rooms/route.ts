import { errorResponse, successResponse } from '../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../lib/auth';
import { createRoomSchema } from '../../../lib/validators';
import { createMultiplayerRoom } from '../../../services/multiplayer-room.service';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const body = createRoomSchema.parse(await req.json());
    const room = await createMultiplayerRoom(user.id, body.deckId, body.displayName);

    return successResponse(room, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
