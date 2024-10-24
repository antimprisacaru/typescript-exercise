import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export function authCanMatchGuard(): CanMatchFn {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.currentUser() ? true : new RedirectCommand(router.parseUrl('/auth/login'));
  };
}
