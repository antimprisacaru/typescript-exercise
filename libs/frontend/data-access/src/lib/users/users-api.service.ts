import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN } from '../tokens/api-url.token';
import { Observable } from 'rxjs';
import { UserDto, UserLoginDto } from './users-api.interfaces';
import { UsersApiRoutes } from './users-api.routes';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = inject(API_URL_TOKEN);

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.API_URL}/${UsersApiRoutes.getCurrentUser()}`);
  }

  login(input: UserLoginDto): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${UsersApiRoutes.postSignIn()}`, input);
  }
}
