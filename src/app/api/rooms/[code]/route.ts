import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getMultiplayerRoom } from '../../../../services/multiplayer-room.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const room = await getMultiplayerRoom(code);

    return successResponse(room);
  } catch (error) {
    return errorResponse(error);
  }
}
