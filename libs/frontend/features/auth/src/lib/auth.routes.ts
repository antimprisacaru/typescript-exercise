import { Route } from '@angular/router';
import { loginCanMatchGuard } from '@typescript-exercise/frontend/core/guards/login.guard';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
    canActivate: [loginCanMatchGuard],
  },
];
