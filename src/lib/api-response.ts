import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

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
  const status = error instanceof ApiError ? error.status : error instanceof ZodError ? 400 : fallbackStatus;
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join('; ')
      : error instanceof Error
        ? error.message
        : 'Unexpected server error';

  return NextResponse.json(
    {
      success: false,
      error: message,
      code: status,
    },
    { status },
  );
}
