import { delay, http, HttpHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '../tokens/api-url.token';
import { ConversationDto } from './conversations-api.interfaces';
import { ConversationsApiRoutes } from './conversations-api.routes';
import { conversations } from './conversations-api.mock';
import { omit } from 'lodash';

export function conversationsMocks(): HttpHandler[] {
  const API_URL = inject(API_URL_TOKEN);

  return [
    http.get<never, never, ConversationDto[]>(`${API_URL}/${ConversationsApiRoutes.getConversations()}`, async () => {
      await delay();
      return HttpResponse.json(conversations.map((c) => omit(c, 'messages')));
    }),
  ];
}
