import { errorResponse, successResponse } from '../../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../../lib/auth';
import { joinRoomSchema } from '../../../../../lib/validators';
import { joinMultiplayerRoom } from '../../../../../services/multiplayer-room.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const { code } = await context.params;
    const body = joinRoomSchema.parse(await req.json());
    const room = await joinMultiplayerRoom(code, user.id, body.displayName);

    return successResponse(room);
  } catch (error) {
    return errorResponse(error);
  }
}
