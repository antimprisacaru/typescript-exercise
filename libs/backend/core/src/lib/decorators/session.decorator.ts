import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Session from 'supertokens-node/recipe/session';

export const GetSession = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const res = ctx.switchToHttp().getResponse();
  return Session.getSession(req, res);
});
