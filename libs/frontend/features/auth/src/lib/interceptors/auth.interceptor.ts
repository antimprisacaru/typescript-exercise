// auth.interceptor.ts
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Token storage keys
const FRONT_TOKEN_KEY = 'front-token';
const ACCESS_TOKEN_KEY = 'st-access-token';
const REFRESH_TOKEN_KEY = 'st-refresh-token';

// Helper functions
const extractAndSaveTokens = (response: HttpResponse<unknown>): void => {
  const frontToken = response.headers.get('front-token');
  const accessToken = response.headers.get('st-access-token');
  const refreshToken = response.headers.get('st-refresh-token');

  if (frontToken) {
    localStorage.setItem(FRONT_TOKEN_KEY, frontToken);
  }
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const addTokensToRequest = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
  if (request.url.includes('login')) {
    return request;
  }

  const frontToken = localStorage.getItem(FRONT_TOKEN_KEY);
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!frontToken || !accessToken) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
      'front-token': frontToken,
    },
  });
};

export function authInterceptor(): HttpInterceptorFn {
  return (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    return next(addTokensToRequest(request)).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          extractAndSaveTokens(event);
        }
      })
    );
  };
}
