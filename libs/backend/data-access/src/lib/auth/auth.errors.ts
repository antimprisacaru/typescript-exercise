import { AppError } from '@typescript-exercise/backend/core/errors/base.error';

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH/INVALID_CREDENTIALS',
  EMAIL_EXISTS = 'AUTH/EMAIL_EXISTS',
  USER_NOT_FOUND = 'AUTH/USER_NOT_FOUND',
  SESSION_INVALID = 'AUTH/SESSION_INVALID',
  USER_CREATION_FAILED = 'AUTH/USER_CREATION_FAILED',
  INVALID_INPUT = 'AUTH/INVALID_INPUT',
}

export class AuthError extends AppError {
  constructor(code: AuthErrorCode, message: string, statusCode = 400, metadata?: Record<string, unknown>) {
    super(code, message, statusCode, metadata);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(metadata?: Record<string, unknown>) {
    super(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid email or password', 401, metadata);
  }
}

export class EmailExistsError extends AuthError {
  constructor(metadata?: Record<string, unknown>) {
    super(AuthErrorCode.EMAIL_EXISTS, 'Email is already registered', 409, metadata);
  }
}

export class UserNotFoundError extends AuthError {
  constructor(metadata?: Record<string, unknown>) {
    super(AuthErrorCode.USER_NOT_FOUND, 'User not found', 404, metadata);
  }
}

export class UserCreationError extends AuthError {
  constructor(error: unknown, metadata?: Record<string, unknown>) {
    super(AuthErrorCode.USER_CREATION_FAILED, 'Failed to create user', 500, {
      ...metadata,
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export class SessionInvalidError extends AuthError {
  constructor(metadata?: Record<string, unknown>) {
    super(AuthErrorCode.SESSION_INVALID, 'Invalid session', 401, metadata);
  }
}
