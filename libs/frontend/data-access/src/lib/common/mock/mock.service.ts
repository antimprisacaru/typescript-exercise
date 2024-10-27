import { Injectable, signal } from '@angular/core';
import { DefaultBodyType, delay, HttpResponseResolver, passthrough, PathParams } from 'msw';

@Injectable({ providedIn: 'root' })
export class MockService {
  public readonly runMocks = signal(false);

  public resolve<Params extends PathParams, RequestBodyType extends DefaultBodyType, ResponseBodyType extends DefaultBodyType>(
    resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>
  ): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
    return async (...args) => {
      await delay();
      if (this.runMocks()) {
        return resolver(...args);
      }

      return passthrough();
    };
  }
}
