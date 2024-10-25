import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation.error';

@Injectable()
export class ValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>, private readonly errorCode: string) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationError.fromZodError(this.errorCode, error);
      }
      throw error;
    }
  }
}
