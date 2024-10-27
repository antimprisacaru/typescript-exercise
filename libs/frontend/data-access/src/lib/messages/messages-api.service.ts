import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageDto, MessageInputDto } from './messages-api.interfaces';
import { MessagesApiRoutes } from './messages-api.routes';
import { API_URL_TOKEN } from '@typescript-exercise/frontend/data-access/common/tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class MessagesApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = inject(API_URL_TOKEN);

  getAllMessages(conversationId: string): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.API_URL}/${MessagesApiRoutes.getMessages(conversationId)}`);
  }

  addMessage(conversationId: string, message: MessageInputDto): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.API_URL}/${MessagesApiRoutes.putMessages(conversationId)}`, message);
  }
}
