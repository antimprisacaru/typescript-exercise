import { inject, Injectable } from '@angular/core';
import { MessageModel } from '../models/message.model';
import { MessagesApiService } from '@typescript-exercise/frontend/data-access/messages/messages-api.service';
import {
  catchError,
  defer,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  scan,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  MessageInputDto,
  MessageStatus,
  WebSocketEvents,
} from '@typescript-exercise/frontend/data-access/messages/messages-api.interfaces';
import { MessagesWebSocketService } from '@typescript-exercise/frontend/data-access/messages/messages-websocket.service';
import { MessagesAction, MessagesState } from '../models/messages.state';

const initialState: MessagesState = {
  data: [],
  loading: false,
  error: null,
} as const;

@Injectable()
export class MessageService {
  private readonly api = inject(MessagesApiService);
  private readonly wsService = inject(MessagesWebSocketService);

  private readonly messageUpdates$ = this.wsService.messages$().pipe(
    filter((msg) => msg.type === WebSocketEvents.MESSAGES_DELIVERED),
    map((wsResponse) => ({
      type: 'MESSAGES_DELIVERED' as const,
      payload: wsResponse.payload,
    })),
    shareReplay(1)
  );

  getMessagesState(conversationId: string, retry$: Observable<void>): Observable<MessagesState> {
    const loadMessages$ = defer(() => {
      return of({ type: 'LOAD_START' as const }).pipe(
        // Join the conversation room
        tap(() => this.wsService.join(conversationId).subscribe()),
        // Load messages
        switchMap(() =>
          this.api.getAllMessages(conversationId).pipe(
            map((messages) => ({
              type: 'LOAD_SUCCESS' as const,
              messages: messages.map((msg) => new MessageModel(msg)),
            })),
            catchError((error) =>
              of({
                type: 'LOAD_ERROR' as const,
                error: error instanceof Error ? error : new Error('Unknown error'),
              })
            ),
            // Mark messages as delivered after loading
            tap(() => this.wsService.markDelivered(conversationId).subscribe())
          )
        )
      );
    });

    // Combine retry stream with initial load
    const retriableLoad$ = retry$.pipe(
      startWith(undefined),
      switchMap(() => loadMessages$)
    );

    // Merge all streams
    return merge(retriableLoad$, this.messageUpdates$).pipe(
      scan((state: MessagesState, action: MessagesAction): MessagesState => {
        switch (action.type) {
          case 'LOAD_START':
            return {
              ...state,
              loading: true,
              error: null,
            };

          case 'LOAD_SUCCESS':
            return {
              data: action.messages,
              loading: false,
              error: null,
            };

          case 'LOAD_ERROR':
            return {
              ...state,
              data: [],
              loading: false,
              error: action.error,
            };

          case 'MESSAGE_ADDED':
            return {
              ...state,
              data: [...state.data, action.message].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
              error: null,
            };

          case 'MESSAGES_DELIVERED':
            return {
              ...state,
              data: state.data.map((message) => ({
                ...message,
                status: action.payload.messageIds.includes(message.id) ? MessageStatus.Received : message.status,
              })),
            };

          default:
            return state;
        }
      }, initialState),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      shareReplay(1)
    );
  }

  getMessages(conversationId: string, retry$: Observable<void>): Observable<MessageModel[]> {
    return this.getMessagesState(conversationId, retry$).pipe(map((state) => state.data));
  }

  getLoading(conversationId: string, retry$: Observable<void>): Observable<boolean> {
    return this.getMessagesState(conversationId, retry$).pipe(map((state) => state.loading));
  }

  getError(conversationId: string, retry$: Observable<void>): Observable<Error | undefined | null> {
    return this.getMessagesState(conversationId, retry$).pipe(map((state) => state.error));
  }

  addMessage(conversationId: string, input: MessageInputDto): Observable<MessageModel> {
    // First send via HTTP for persistence
    return this.api.addMessage(conversationId, input).pipe(
      map((message) => new MessageModel(message)),
      tap(() => {
        // Just emit the message text via WebSocket
        this.wsService.emit(WebSocketEvents.NEW_MESSAGE, {
          text: input.text,
        });
      }),
      catchError((error) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        throw new Error(errorMessage);
      })
    );
  }

  markMessagesAsDelivered(conversationId: string): Observable<void> {
    return defer(() => {
      return this.wsService.markDelivered(conversationId);
    });
  }

  leaveConversation(conversationId: string): void {
    this.wsService.leave(conversationId);
  }

  dispose(): void {
    this.wsService.disconnect();
  }
}
