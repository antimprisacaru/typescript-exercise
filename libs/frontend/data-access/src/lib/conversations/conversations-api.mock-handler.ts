import { http, HttpHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '../tokens/api-url.token';
import { ConversationDto } from './conversations-api.interfaces';
import { ConversationsApiRoutes } from './conversations-api.routes';
import { conversations } from './conversations-api.mock';
import { omit } from 'lodash';
import { MockService } from '../mock/mock.service';

export function conversationsMocks(): HttpHandler[] {
  const API_URL = inject(API_URL_TOKEN);
  const mock = inject(MockService);

  return [
    http.get<never, never, ConversationDto[]>(
      `${API_URL}/${ConversationsApiRoutes.getConversations()}`,
      mock.resolve(() => {
        return HttpResponse.json(conversations.map((c) => omit(c, 'messages')));
      })
    ),
  ];
}
