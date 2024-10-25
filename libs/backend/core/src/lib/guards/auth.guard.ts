import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    try {
      await Session.getSession(req, res, {
        sessionRequired: true,
        antiCsrfCheck: true,
      });
      return true;
    } catch {
      return false;
    }
  }
}
