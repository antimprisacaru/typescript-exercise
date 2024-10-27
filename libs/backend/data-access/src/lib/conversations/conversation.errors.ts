import { MessageError } from '../message/message.errors';

export enum MessageErrorCode {
  CONVERSATION_ACCESS_DENIED = 'MESSAGE/CONVERSATION_ACCESS_DENIED',
}

export class ConversationAccessError extends MessageError {
  constructor(metadata?: Record<string, unknown>) {
    super(MessageErrorCode.CONVERSATION_ACCESS_DENIED, 'Access to conversation denied', 403, metadata);
  }
}
