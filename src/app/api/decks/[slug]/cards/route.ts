import { ApiError, errorResponse, successResponse } from '../../../../../lib/api-response';
import { getCardsForDeckSlug } from '../../../../../services/deck.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const cards = await getCardsForDeckSlug(slug);

    if (!cards) {
      throw new ApiError(404, 'Deck not found');
    }

    return successResponse(cards);
  } catch (error) {
    return errorResponse(error);
  }
}
