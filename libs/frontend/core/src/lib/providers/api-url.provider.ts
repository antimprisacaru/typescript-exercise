import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { API_URL_TOKEN } from '@typescript-exercise/data-access/tokens/api-url.token';

export function provideApiUrl(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: API_URL_TOKEN,
      useValue: 'http://127.0.0.1:3000',
    },
  ]);
}
