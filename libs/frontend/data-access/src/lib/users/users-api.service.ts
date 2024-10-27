import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/api-url.token';
import { Observable } from 'rxjs';
import { UserDto, UserLoginDto, UserRegisterDto } from './users-api.interfaces';
import { UsersApiRoutes } from './users-api.routes';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = inject(API_URL_TOKEN);

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.API_URL}/${UsersApiRoutes.getCurrentUser()}`);
  }

  login(input: UserLoginDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.API_URL}/${UsersApiRoutes.postLogin()}`, input);
  }

  register(input: UserRegisterDto): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${UsersApiRoutes.postRegister()}`, input);
  }
}
