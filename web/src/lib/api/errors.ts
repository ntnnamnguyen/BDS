export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;
  readonly code?: string;

  constructor(
    message: string,
    options: { status: number; details?: unknown; code?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.details = options.details;
    this.code = options.code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Không thể kết nối tới hệ thống dữ liệu.",
): string {
  return isApiError(error) ? error.message : fallback;
}
