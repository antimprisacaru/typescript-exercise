import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SupertokensMiddleware implements NestMiddleware {
  supertokensMiddleware: ReturnType<typeof middleware>;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.supertokensMiddleware(req, res, next);
  }
}
