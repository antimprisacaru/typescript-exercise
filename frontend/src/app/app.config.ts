import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideApiUrl } from '@typescript-exercise/core/providers/api-url.provider';
import { provideAppInitializer } from '@typescript-exercise/core/providers/app-initializer.provider';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideApiUrl(),
    provideAppInitializer(),
  ],
};
