import { UserDto } from '../users/users-api.interfaces';

export interface MessageDto {
  id: string;
  text: string;
  status: MessageStatus;
  sender: UserDto;
  timestamp: string;
}

export interface MessageInputDto {
  text: string;
}

export enum MessageStatus {
  Sent = 'SENT',
  Received = 'RECEIVED',
}

export const WebSocketEvents = {
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  MARK_DELIVERED: 'mark_delivered',
  MESSAGES_DELIVERED: 'messages_delivered',
  NEW_MESSAGE: 'new_message', // Client -> Server
  ERROR: 'error',
} as const;

export type WebSocketEventMap = {
  [WebSocketEvents.JOIN_CONVERSATION]: string;
  [WebSocketEvents.LEAVE_CONVERSATION]: string;
  [WebSocketEvents.MARK_DELIVERED]: string;
  [WebSocketEvents.MESSAGES_DELIVERED]: MessagesDeliveredEvent;
  [WebSocketEvents.NEW_MESSAGE]: { text: string };
  [WebSocketEvents.ERROR]: WebSocketErrorEvent;
};

export interface MessagesDeliveredEvent {
  conversationId: string;
  deliveredBy: string;
  messageIds: string[];
}

export interface WebSocketErrorEvent {
  code: string;
  message: string;
}

export type WebSocketResponse<T extends keyof WebSocketEventMap> = {
  type: T;
  payload: WebSocketEventMap[T];
};
