import { Provider } from '@angular/core';
import { WS_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/ws-url.token';

export function provideWSUrl(): Provider {
  return [
    {
      provide: WS_URL_TOKEN,
      useValue: 'http://127.0.0.1:3000',
    },
  ];
}
