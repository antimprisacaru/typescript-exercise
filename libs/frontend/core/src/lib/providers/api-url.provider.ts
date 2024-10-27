import { Provider } from '@angular/core';
import { API_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/api-url.token';

export function provideApiUrl(): Provider {
  return [
    {
      provide: API_URL_TOKEN,
      useValue: 'http://127.0.0.1:3000',
    },
  ];
}
