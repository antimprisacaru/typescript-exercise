import { delay, http, HttpHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '../tokens/api-url.token';
import { UsersApiRoutes } from './users-api.routes';
import { UserDto, UserLoginDto } from './users-api.interfaces';
import { DEFAULT_USER } from './users-data.mock';

export function usersMocks(): HttpHandler[] {
  const API_URL = inject(API_URL_TOKEN);

  return [
    http.get<never, never, UserDto>(`${API_URL}/${UsersApiRoutes.getCurrentUser()}`, async () => {
      await delay();
      return HttpResponse.json(DEFAULT_USER);
    }),
    http.post<never, UserLoginDto, never>(`${API_URL}/${UsersApiRoutes.postLogin()}`, async () => {
      await delay();
      // For mock testing scenarios, this will always come as 200 ok
      // Surely, it can be configured for various scenarios, but currently out of scope for this assignment
      return HttpResponse.json(undefined, { status: 200 });
    }),
  ];
}