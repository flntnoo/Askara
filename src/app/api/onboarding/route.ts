import { errorResponse, successResponse } from '../../../lib/api-response';
import { getOrCreateGuestUser } from '../../../lib/auth';
import { onboardingPreferenceSchema } from '../../../lib/validators';
import { getPreference, savePreference } from '../../../services/onboarding.service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getOrCreateGuestUser(req);
    const preference = await getPreference(user.id);

    return successResponse(preference);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateGuestUser(req);
    const body = onboardingPreferenceSchema.parse(await req.json());
    const preference = await savePreference(user.id, body);

    return successResponse(preference, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
