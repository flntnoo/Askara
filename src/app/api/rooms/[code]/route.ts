import { errorResponse, successResponse } from '../../../../lib/api-response';
import { getOptionalGuestUser } from '../../../../lib/auth';
import { getMultiplayerRoom } from '../../../../services/multiplayer-room.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const user = await getOptionalGuestUser(req);
    const { code } = await context.params;
    const room = await getMultiplayerRoom(code, user?.id);

    return successResponse(room);
  } catch (error) {
    return errorResponse(error);
  }
}
