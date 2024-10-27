import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/api-url.token';
import { Observable } from 'rxjs';
import { ConversationDto } from './conversations-api.interfaces';
import { ConversationsApiRoutes } from './conversations-api.routes';

@Injectable({ providedIn: 'root' })
export class ConversationsApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = inject(API_URL_TOKEN);

  getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.API_URL}/${ConversationsApiRoutes.getConversations()}`);
  }
}
