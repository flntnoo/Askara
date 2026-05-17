import { errorResponse, successResponse } from '../../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../../lib/auth';
import { moveRoomToNextTurn } from '../../../../../services/multiplayer-room.service';

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
    const room = await moveRoomToNextTurn(code, user.id);

    return successResponse(room);
  } catch (error) {
    return errorResponse(error);
  }
}
