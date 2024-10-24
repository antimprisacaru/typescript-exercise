import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { UsersApiService } from '@typescript-exercise/data-access/users/users-api.service';
import { UserModel } from '../models/user.model';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserLoginDto } from '@typescript-exercise/data-access/users/users-api.interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(UsersApiService);
  private readonly _currentUser = signal<UserModel | undefined>(undefined);

  public readonly currentUser: Signal<UserModel> = computed(() => this._currentUser()!);

  getCurrentUser(): Observable<UserModel | undefined> {
    return this.api.getCurrentUser().pipe(
      map((result) => new UserModel(result)),
      catchError(() => of(undefined)),
      tap((user: UserModel | undefined) => {
        this._currentUser.set(user);
      })
    );
  }

  login(input: UserLoginDto): Observable<UserModel> {
    // TODO: save token in local storage
    return this.api.login(input).pipe(switchMap(() => this.api.getCurrentUser()));
  }
}
