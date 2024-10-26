import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '@typescript-exercise/backend/data-access/common/errors/validation.error';
import { OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class ValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(
    private readonly schema: ZodSchema<T>,
    private readonly errorCode: string,
    @Inject(OgmaService) private readonly logger?: OgmaService
  ) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        this.logValidationError(error, value);
        throw ValidationError.fromZodError(this.errorCode, error);
      }
      throw error;
    }
  }

  private logValidationError(error: ZodError, value: unknown): void {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      code: err.code,
      message: err.message,
    }));

    this.logger?.warn('Validation failed', {
      context: 'ValidationPipe',
      errorCode: this.errorCode,
      errors: formattedErrors,
      receivedValue: value,
    });
  }
}
