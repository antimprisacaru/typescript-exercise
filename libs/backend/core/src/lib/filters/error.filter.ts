import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { AppError } from '@typescript-exercise/backend/data-access/common/errors/base.error';
import { ZodError } from 'zod';
import { EnvironmentConfigService } from '../config/env.config';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { omit } from 'lodash';

interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  metadata?: Record<string, unknown>;
}

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(
    @OgmaLogger(GlobalErrorFilter) private readonly logger: OgmaService,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly config: EnvironmentConfigService
  ) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.createErrorResponse(error, request);

    // Log error details
    this.logError(error, errorResponse);

    httpAdapter.reply(response, this.stripResponse(errorResponse), errorResponse.statusCode);
  }

  private createErrorResponse<T extends { url: string }>(error: unknown, request: T): ErrorResponse {
    const baseResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (error instanceof AppError) {
      return {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        metadata: error.metadata,
        ...baseResponse,
      };
    }

    if (error instanceof HttpException) {
      return {
        code: 'HTTP_ERROR',
        message: error.message,
        statusCode: error.getStatus(),
        metadata: this.getHttpExceptionMetadata(error),
        ...baseResponse,
      };
    }

    if (error instanceof ZodError) {
      return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: HttpStatus.BAD_REQUEST,
        metadata: {
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        },
        ...baseResponse,
      };
    }

    // Handle unexpected errors
    const unknownError = error as Error;
    return {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      metadata: this.config.isDevelopment
        ? {
            name: unknownError.name,
            message: unknownError.message,
            stack: unknownError.stack,
          }
        : undefined,
      ...baseResponse,
    };
  }

  private getHttpExceptionMetadata(error: HttpException): Record<string, unknown> {
    const response = error.getResponse();
    if (typeof response === 'object') {
      return response as Record<string, unknown>;
    }
    return { detail: response };
  }

  private logError(error: unknown, errorResponse: ErrorResponse): void {
    const logContext = {
      code: errorResponse.code,
      path: errorResponse.path,
      timestamp: errorResponse.timestamp,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(error instanceof Error ? error.stack : 'Unknown error', logContext);
    } else {
      this.logger.warn(errorResponse.message, logContext);
    }
  }

  private stripResponse(error: ErrorResponse): Omit<ErrorResponse, 'metadata'> {
    return omit(error, 'metadata');
  }
}
