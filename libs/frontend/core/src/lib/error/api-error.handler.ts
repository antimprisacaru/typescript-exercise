import { ApiError, ErrorMap } from '@typescript-exercise/frontend/data-access/error/api.error';
import { catchError, Observable, of, throwError } from 'rxjs';

// Handler types
type ErrorEffect<T extends ErrorMap> = (error: ApiError<T>) => void;
type ErrorResult<T extends ErrorMap, R> = (error: ApiError<T>) => R;

// Handler configurations
type ErrorEffectHandlers<T extends ErrorMap> = {
  [P in Exclude<keyof T, 'UNKNOWN_ERROR'>]?: ErrorEffect<T>;
} & {
  UNKNOWN_ERROR: ErrorEffect<T>;
};

type ErrorResultHandlers<T extends ErrorMap, R> = {
  [P in Exclude<keyof T, 'UNKNOWN_ERROR'>]?: ErrorResult<T, R>;
} & {
  UNKNOWN_ERROR: ErrorResult<T, R>;
};

// Effect-based handler (throws error after side effect)
export function handleApiError<K extends ErrorMap>(handlers: ErrorEffectHandlers<K>): <T>(source: Observable<T>) => Observable<T>;

// Result-based handler (returns a value instead of throwing)
export function handleApiError<K extends ErrorMap, R>(handlers: ErrorResultHandlers<K, R>): <T>(source: Observable<T>) => Observable<T | R>;

// Implementation
export function handleApiError<K extends ErrorMap, R = never>(handlers: ErrorEffectHandlers<K> | ErrorResultHandlers<K, R>) {
  return <T>(source: Observable<T>): Observable<T | R> =>
    source.pipe(
      catchError((error: unknown) => {
        if (ApiError.isApiError<K>(error)) {
          const specificHandler = handlers[error.code as Exclude<keyof K, 'UNKNOWN_ERROR'>];

          if (specificHandler) {
            const result = specificHandler(error);
            return typeof result === 'undefined' ? throwError(() => error) : of(result as R);
          } else {
            const result = handlers.UNKNOWN_ERROR(error);
            return typeof result === 'undefined' ? throwError(() => error) : of(result as R);
          }
        } else {
          const defaultError = new ApiError<K>({
            code: 'UNKNOWN_ERROR',
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
            originalError: error,
          });
          const result = handlers.UNKNOWN_ERROR(defaultError);
          return typeof result === 'undefined' ? throwError(() => defaultError) : of(result as R);
        }
      })
    );
}
