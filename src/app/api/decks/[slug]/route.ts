import { ApiError, errorResponse, successResponse } from '../../../../lib/api-response';
import { getDeckWithPreview } from '../../../../services/deck.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const deck = await getDeckWithPreview(slug);

    if (!deck) {
      throw new ApiError(404, 'Deck not found');
    }

    return successResponse(deck);
  } catch (error) {
    return errorResponse(error);
  }
}
