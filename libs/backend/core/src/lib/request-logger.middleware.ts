import { Injectable, NestMiddleware } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(@OgmaLogger(RequestLoggerMiddleware) private readonly logger: OgmaService) {}

  use(request: Request, _: Response, next: NextFunction): void {
    const { method, originalUrl, body } = request;

    this.logger.debug(`${method} ${originalUrl} - Body: ${JSON.stringify(body)}`);

    next();
  }
}
