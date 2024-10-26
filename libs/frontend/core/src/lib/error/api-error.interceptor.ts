import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { ApiError, ErrorMap } from '@typescript-exercise/frontend/data-access/error/api.error';

interface ErrorResponse {
  code: string;
  message: string;
  metadata?: Record<string, unknown>;
}

function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof error.code === 'string' &&
    typeof error.message === 'string'
  );
}

export function apiErrorInterceptor(): HttpInterceptorFn {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error && isErrorResponse(error.error)) {
            return throwError(
              () =>
                new ApiError<ErrorMap>({
                  code: 'UNKNOWN_ERROR',
                  message: error.error.message,
                  originalError: error,
                })
            );
          }

          if (!error.error && error.status === 0) {
            return throwError(
              () =>
                new ApiError<ErrorMap>({
                  code: 'UNKNOWN_ERROR',
                  message: 'Network error occurred',
                  originalError: error,
                })
            );
          }

          if (error.status >= 500) {
            return throwError(
              () =>
                new ApiError<ErrorMap>({
                  code: 'UNKNOWN_ERROR',
                  message: 'Server error occurred',
                  originalError: error,
                })
            );
          }
        }

        return throwError(
          () =>
            new ApiError<ErrorMap>({
              code: 'UNKNOWN_ERROR',
              message: error instanceof Error ? error.message : 'An unexpected error occurred',
              originalError: error,
            })
        );
      })
    );
  };
}
