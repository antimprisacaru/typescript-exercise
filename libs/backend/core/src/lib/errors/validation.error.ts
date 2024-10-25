import { AppError } from './base.error';
import { ZodError } from 'zod';

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export class ValidationError extends AppError {
  constructor(code: string, details: ValidationErrorDetail[], metadata?: Record<string, any>) {
    super(code, 'Validation failed', 400, {
      ...metadata,
      details,
    });
  }

  static fromZodError(code: string, error: ZodError): ValidationError {
    const details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    return new ValidationError(code, details);
  }
}
