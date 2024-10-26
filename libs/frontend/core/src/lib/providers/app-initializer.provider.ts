import { APP_INITIALIZER, EnvironmentInjector, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { UserService } from '../services/user.service';
import { firstValueFrom, map, take } from 'rxjs';
import { initMockHandlers } from '../mock/initialize-mock-handlers.function';

function bootstrapFn(injector: EnvironmentInjector, userService: UserService): () => Promise<void> {
  return async (): Promise<void> => {
    const initializedHandlers = initMockHandlers(injector);
    // const worker = setupWorker(...initializedHandlers);
    // await worker.start({ onUnhandledRequest: 'bypass' });
    return firstValueFrom(
      userService.getCurrentUser().pipe(
        take(1),
        map(() => undefined)
      )
    );
  };
}

export function provideAppInitializer(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrapFn,
      deps: [EnvironmentInjector, UserService],
      multi: true,
    },
  ]);
}
