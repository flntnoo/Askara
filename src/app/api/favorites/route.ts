import { errorResponse, successResponse } from '../../../lib/api-response';
import { getCurrentUserOrGuest } from '../../../lib/auth';
import { favoriteSchema } from '../../../lib/validators';
import { addFavorite, clearFavorites, getFavorites, removeFavorite } from '../../../services/favorite.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const favorites = await getFavorites(user.id);

    return successResponse(favorites);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const body = favoriteSchema.parse(await req.json());
    const favorites = await addFavorite(user.id, body.cardId);

    return successResponse(favorites, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUserOrGuest(req);
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      const favorites = await clearFavorites(user.id);
      return successResponse(favorites);
    }

    const favorites = await removeFavorite(user.id, cardId);
    return successResponse(favorites);
  } catch (error) {
    return errorResponse(error);
  }
}
