import { inject, Injectable } from '@angular/core';
import { ConversationsApiService } from '@typescript-exercise/data-access/conversations/conversations-api.service';
import { ConversationModel } from '../models/conversation.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private readonly api = inject(ConversationsApiService);

  getConversations(): Observable<ConversationModel[]> {
    return this.api.getConversations().pipe(map((result) => result.map((c) => new ConversationModel(c))));
  }
}
