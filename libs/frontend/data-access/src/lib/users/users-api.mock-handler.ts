import { http, HttpHandler, HttpResponse } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/api-url.token';
import { UsersApiRoutes } from './users-api.routes';
import { UserDto, UserLoginDto } from './users-api.interfaces';
import { DEFAULT_USER } from './users-data.mock';
import { MockService } from '@typescript-exercise/frontend/data-access/common/mock/mock.service';

export function usersMocks(): HttpHandler[] {
  const API_URL = inject(API_URL_TOKEN);
  const mock = inject(MockService);

  return [
    http.get<never, never, UserDto>(
      `${API_URL}/${UsersApiRoutes.getCurrentUser()}`,
      mock.resolve(() => {
        return HttpResponse.json(DEFAULT_USER);
      })
    ),
    http.post<never, UserLoginDto, null>(
      `${API_URL}/${UsersApiRoutes.postLogin()}`,
      mock.resolve(() => {
        // For mock testing scenarios, this will always come as 200 ok
        // Surely, it can be configured for various scenarios, but currently out of scope for this assignment
        return HttpResponse.json(undefined, { status: 200 });
      })
    ),
  ];
}
