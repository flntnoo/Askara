import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function errorResponse(error: unknown, fallbackStatus = 500) {
  const status = error instanceof ApiError ? error.status : fallbackStatus;
  const message = error instanceof Error ? error.message : 'Unexpected server error';

  return NextResponse.json(
    {
      success: false,
      error: message,
      code: status,
    },
    { status },
  );
}
