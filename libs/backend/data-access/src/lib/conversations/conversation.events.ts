export enum WebSocketEvents {
  // Connection events
  JOIN_CONVERSATION = 'join_conversation',
  LEAVE_CONVERSATION = 'leave_conversation',

  // Message events
  NEW_MESSAGE = 'new_message',
  MESSAGE_SENT = 'message_sent',
  MARK_DELIVERED = 'mark_delivered',
  MESSAGES_DELIVERED = 'messages_delivered',

  // Error events
  ERROR = 'error',
}
