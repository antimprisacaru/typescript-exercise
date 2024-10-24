import { Route } from '@angular/router';
import { authCanMatchGuard } from '@typescript-exercise/core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('@typescript-exercise/features/auth').then((c) => c.routes),
  },
  {
    path: '',
    canMatch: [authCanMatchGuard()],
    loadComponent: () =>
      import('@typescript-exercise/core/components/core/core.component').then((c) => c.CoreComponent),
    children: [
      {
        path: '',
        redirectTo: '/chat',
        pathMatch: 'full',
      },
      {
        path: 'chat',
        loadChildren: () => import('@typescript-exercise/features/chat').then((c) => c.routes),
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@typescript-exercise/core/components/not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/not-found',
    pathMatch: 'full',
  },
];
