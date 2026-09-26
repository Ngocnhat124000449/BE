
import type { Response } from "express";
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

export function sqlErrorNumber(error: unknown): number | undefined {
  const n = (error as { number?: unknown }).number;
  return typeof n === "number" ? n : undefined;
}

export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(fail(error.message));
    return;
  }
  res.status(500).json(fail(getErrorMessage(error)));
}