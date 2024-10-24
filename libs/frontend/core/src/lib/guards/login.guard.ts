import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export function loginCanMatchGuard(): CanActivateFn {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);

    return !userService.currentUser() ? true : new RedirectCommand(router.parseUrl('/'));
  };
}
