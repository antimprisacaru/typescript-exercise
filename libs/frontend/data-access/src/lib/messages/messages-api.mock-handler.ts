import { delay, http, HttpHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '../tokens/api-url.token';
import { MessageDto, MessageInputDto } from './messages-api.interfaces';
import { MessagesApiRoutes } from './messages-api.routes';
import { addMessage, getMessages } from '../conversations/conversations-api.mock';

export function messageMocks(): HttpHandler[] {
  const API_URL = inject(API_URL_TOKEN);

  return [
    http.get<
      {
        conversationId: string;
      },
      never,
      MessageDto[]
    >(`${API_URL}/${MessagesApiRoutes.getMessages()}`, async ({ params }) => {
      const conversationId = params.conversationId;

      const messages = getMessages(conversationId);

      await delay();

      if (!messages) {
        return HttpResponse.json(undefined, { status: 404 });
      }

      return HttpResponse.json(messages);
    }),
    http.post<
      {
        conversationId: string;
      },
      MessageInputDto,
      MessageDto
    >(`${API_URL}/${MessagesApiRoutes.putMessages()}`, async ({ params, request }) => {
      const conversationId = params.conversationId;
      const input = await request.json();
      await delay();

      const result = addMessage(conversationId, input);

      if (!result) {
        return HttpResponse.json(undefined, { status: 404 });
      }

      return HttpResponse.json(result);
    }),
  ];
}
