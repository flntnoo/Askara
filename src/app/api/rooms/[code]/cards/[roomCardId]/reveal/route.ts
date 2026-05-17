import { errorResponse, successResponse } from '../../../../../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../../../../../lib/auth';
import { revealRoomCard } from '../../../../../../../services/multiplayer-room.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    code: string;
    roomCardId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const { code, roomCardId } = await context.params;
    const room = await revealRoomCard(code, user.id, roomCardId);

    return successResponse(room);
  } catch (error) {
    return errorResponse(error);
  }
}
