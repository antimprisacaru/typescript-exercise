import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { UsersApiService } from '@typescript-exercise/frontend/data-access/users/users-api.service';
import { UserModel } from '../models/user.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserDto, UserLoginDto, UserRegisterDto } from '@typescript-exercise/frontend/data-access/users/users-api.interfaces';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(UsersApiService);
  private readonly router = inject(Router);
  private readonly _currentUser = signal<UserModel | undefined>(undefined);

  public readonly currentUser: Signal<UserModel> = computed(() => this._currentUser()!);

  getCurrentUser(): Observable<UserModel | undefined> {
    return this.api.getCurrentUser().pipe(
      map((result) => this.setCurrentUser(result)),
      tap(() => this.router.navigateByUrl('/')),
      catchError(() => of(undefined))
    );
  }

  login(input: UserLoginDto): Observable<UserModel> {
    return this.api.login(input).pipe(map((result) => this.setCurrentUser(result)));
  }

  register(input: UserRegisterDto): Observable<void> {
    return this.api.register(input);
  }

  private setCurrentUser(result: UserDto): UserModel {
    const user = new UserModel(result);
    this._currentUser.set(user);
    return user;
  }
}
