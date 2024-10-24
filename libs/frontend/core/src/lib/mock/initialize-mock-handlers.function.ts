import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { RequestHandler } from 'msw';
import { flatMap } from 'lodash';
import { messageMocks } from '@typescript-exercise/data-access/messages/messages-api.mock-handler';
import { conversationsMocks } from '@typescript-exercise/data-access/conversations/conversations-api.mock-handler';
import { usersMocks } from '@typescript-exercise/data-access/users/users-api.mock-handler';

const mockHandlers = [usersMocks, conversationsMocks, messageMocks];

export function initMockHandlers(injector: EnvironmentInjector): ReadonlyArray<RequestHandler> {
  return flatMap(mockHandlers.map((fn) => runInInjectionContext(injector, () => fn())));
}
