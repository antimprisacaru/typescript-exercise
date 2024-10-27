/* eslint-disable @nx/enforce-module-boundaries */
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideApiUrl } from '@typescript-exercise/frontend/core/providers/api-url.provider';
import { provideAppInitializer } from '@typescript-exercise/frontend/core/providers/app-initializer.provider';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiErrorInterceptor } from '@typescript-exercise/frontend/core/error/api-error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from '@typescript-exercise/frontend/features/auth';
import { provideWSUrl } from '@typescript-exercise/frontend/core/providers/ws-url.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiErrorInterceptor(), authInterceptor()])),
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideRouter(appRoutes),
    provideApiUrl(),
    provideWSUrl(),
    provideAppInitializer(),
  ],
};
