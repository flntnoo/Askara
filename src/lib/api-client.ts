import { getOrCreateAnonymousUser } from '../utils/storage';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: string;
  code: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiClientError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const anonymousUser = getOrCreateAnonymousUser();
  const headers = new Headers(init.headers);
  headers.set('x-anonymous-id', anonymousUser.id);

  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success) {
    throw new ApiClientError(payload.error, payload.code);
  }

  return payload.data;
}
