import { ApiError, errorResponse, successResponse } from '../../../lib/api-response';
import { deckCategorySchema } from '../../../lib/validators';
import { getAllDecks } from '../../../services/deck.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;

    if (category) {
      const result = deckCategorySchema.safeParse(category);

      if (!result.success) {
        throw new ApiError(400, 'Invalid deck category');
      }
    }

    const decks = await getAllDecks(category);
    return successResponse(decks);
  } catch (error) {
    return errorResponse(error);
  }
}
