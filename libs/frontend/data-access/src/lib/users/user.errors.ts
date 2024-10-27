import { createErrorMap, UNKNOWN_ERROR } from '@typescript-exercise/frontend/data-access/common/error/api.error';

export const USER_ERRORS = createErrorMap({
  INVALID_CREDENTIALS: 'AUTH/INVALID_CREDENTIALS',
  EMAIL_EXISTS: 'AUTH/EMAIL_EXISTS',
  USER_NOT_FOUND: 'AUTH/USER_NOT_FOUND',
  SESSION_INVALID: 'AUTH/SESSION_INVALID',
  USER_CREATION_FAILED: 'AUTH/USER_CREATION_FAILED',
  INVALID_INPUT: 'AUTH/INVALID_INPUT',
  UNKNOWN_ERROR,
} as const);

export type UserErrorMap = typeof USER_ERRORS;
