import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, defer, EMPTY, Observable, share } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { WS_URL_TOKEN } from '../common/tokens/ws-url.token';
import {
  MessagesDeliveredEvent,
  WebSocketErrorEvent,
  WebSocketEventMap,
  WebSocketEvents,
  WebSocketResponse,
} from './messages-api.interfaces';
import { ACCESS_TOKEN_KEY } from '../common/constants/auth.constants';

@Injectable({ providedIn: 'root' })
export class MessagesWebSocketService {
  private readonly wsUrl = inject(WS_URL_TOKEN);
  private socket: Socket | null = null;
  private readonly connectionStatus$ = new BehaviorSubject<boolean>(false);

  private connect(): Socket {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)!;

    if (!this.socket) {
      this.socket = io(this.wsUrl, {
        auth: {
          token: accessToken,
        },
        withCredentials: true,
        autoConnect: false,
      });

      this.socket.on('connect', () => {
        this.connectionStatus$.next(true);
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        this.connectionStatus$.next(false);
        console.log('WebSocket disconnected');
      });

      this.socket.connect();
    }
    return this.socket;
  }

  emit<E extends keyof WebSocketEventMap>(event: E, payload: WebSocketEventMap[E]): void {
    const socket = this.connect();
    socket.emit(event, payload);
  }

  join(conversationId: string): Observable<void> {
    return defer(() => {
      this.emit(WebSocketEvents.JOIN_CONVERSATION, conversationId);
      return EMPTY;
    });
  }

  leave(conversationId: string): void {
    if (this.socket?.connected) {
      this.emit(WebSocketEvents.LEAVE_CONVERSATION, conversationId);
    }
  }

  markDelivered(conversationId: string): Observable<void> {
    return defer(() => {
      this.emit(WebSocketEvents.MARK_DELIVERED, conversationId);
      return EMPTY;
    });
  }

  messages$(): Observable<WebSocketResponse<typeof WebSocketEvents.MESSAGES_DELIVERED>> {
    return new Observable<WebSocketResponse<typeof WebSocketEvents.MESSAGES_DELIVERED>>((subscriber) => {
      const socket = this.connect();

      const messageHandler = (payload: MessagesDeliveredEvent) => {
        subscriber.next({
          type: WebSocketEvents.MESSAGES_DELIVERED,
          payload,
        });
      };

      const errorHandler = (payload: WebSocketErrorEvent) => {
        subscriber.error({
          type: WebSocketEvents.ERROR,
          payload,
        });
      };

      socket.on(WebSocketEvents.MESSAGES_DELIVERED, messageHandler);
      socket.on(WebSocketEvents.ERROR, errorHandler);

      return () => {
        socket.off(WebSocketEvents.MESSAGES_DELIVERED, messageHandler);
        socket.off(WebSocketEvents.ERROR, errorHandler);
      };
    }).pipe(
      catchError(() => EMPTY),
      share()
    );
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }
}
