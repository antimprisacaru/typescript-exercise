import { inject, Injectable } from '@angular/core';
import { MessageModel } from '../models/message.model';
import { MessagesApiService } from '@typescript-exercise/frontend/data-access/messages/messages-api.service';
import { map, Observable } from 'rxjs';
import { MessageInputDto } from '@typescript-exercise/frontend/data-access/messages/messages-api.interfaces';

@Injectable()
export class MessageService {
  private readonly api = inject(MessagesApiService);

  getAllMessages(conversationId: string): Observable<MessageModel[]> {
    return this.api.getAllMessages(conversationId).pipe(map((messages) => messages.map((m) => new MessageModel(m))));
  }

  addMessage(conversationId: string, input: MessageInputDto): Observable<MessageModel> {
    return this.api.addMessage(conversationId, input).pipe(map((message) => new MessageModel(message)));
  }
}
