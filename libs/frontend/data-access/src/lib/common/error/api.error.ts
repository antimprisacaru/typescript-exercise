export const UNKNOWN_ERROR = 'errors/unknown' as const;

export interface ErrorMap {
  UNKNOWN_ERROR: typeof UNKNOWN_ERROR;
}

type ErrorMapType<T extends Record<string, string>> = T & ErrorMap;

// Helper function to create error maps with type inference
export function createErrorMap<T extends Record<string, string>>(errors: T & { UNKNOWN_ERROR: typeof UNKNOWN_ERROR }): ErrorMapType<T> {
  return errors;
}

// api-error.class.ts
export class ApiError<T extends ErrorMap> extends Error {
  public readonly code: keyof T;
  public readonly originalError?: unknown;

  constructor(input: { code: keyof T; message: string; originalError?: unknown }) {
    super(input.message);
    this.code = input.code;
    this.originalError = input.originalError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static isApiError<T extends ErrorMap>(error: unknown): error is ApiError<T> {
    return error instanceof ApiError;
  }
}
