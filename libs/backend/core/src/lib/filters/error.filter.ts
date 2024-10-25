import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { AppError } from '../errors/base.error';
import { ZodError } from 'zod';

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
  private readonly logger = new Logger(GlobalErrorFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.createErrorResponse(error, request);

    // Log error details
    this.logError(error, errorResponse);

    httpAdapter.reply(response, errorResponse, errorResponse.statusCode);
  }

  private createErrorResponse(error: unknown, request: any): ErrorResponse {
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
      metadata:
        process.env['NODE_ENV'] === 'development'
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
}
