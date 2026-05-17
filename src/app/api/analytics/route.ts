import { errorResponse, successResponse } from '../../../lib/api-response';
import { getOptionalGuestUser } from '../../../lib/auth';
import { analyticsRequestSchema } from '../../../lib/validators';
import { logAnalyticsEvents } from '../../../services/analytics.service';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const parsed = analyticsRequestSchema.parse(await req.json());
    const user = await getOptionalGuestUser(req);
    const events = Array.isArray(parsed) ? parsed : 'events' in parsed ? parsed.events : [parsed];

    try {
      const result = await logAnalyticsEvents(user?.id ?? null, events);
      return successResponse(result, { status: 201 });
    } catch (error) {
      console.error('Analytics logging failed:', error);
      return successResponse({ count: 0, dropped: events.length });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
