import { MessageModel } from './message.model';
import { MessagesDeliveredEvent } from '@typescript-exercise/frontend/data-access/messages/messages-api.interfaces';

export interface MessagesState {
  data: MessageModel[];
  loading: boolean;
  error?: Error | null;
}

export type MessagesAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; messages: MessageModel[] }
  | { type: 'LOAD_ERROR'; error: Error }
  | { type: 'MESSAGES_DELIVERED'; payload: MessagesDeliveredEvent }
  | { type: 'MESSAGE_ADDED'; message: MessageModel };
