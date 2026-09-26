export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function ok<T>(message: string, data?: T): ApiResponse<T> {
  return data === undefined ? { success: true, message } : { success: true, message, data };
}

export function fail(message: string): ApiResponse<never> {
  return { success: false, message };
}

export class AppError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}