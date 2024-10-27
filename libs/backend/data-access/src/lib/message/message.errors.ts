import { AppError } from '../common/errors/base.error';

export enum MessageErrorCode {
  UNAUTHORIZED_ACCESS = 'MESSAGE/UNAUTHORIZED_ACCESS',
  DELIVERY_FAILED = 'MESSAGE/DELIVERY_FAILED',
  WEBSOCKET_AUTH_FAILED = 'MESSAGE/WEBSOCKET_AUTH_FAILED',
  CONVERSATION_ACCESS_DENIED = 'MESSAGE/CONVERSATION_ACCESS_DENIED',
  INVALID_MESSAGE_FORMAT = 'MESSAGE/INVALID_FORMAT',
  CONNECTION_ERROR = 'MESSAGE/CONNECTION_ERROR',
}

export class MessageError extends AppError {
  constructor(code: MessageErrorCode, message: string, statusCode = 400, metadata?: Record<string, unknown>) {
    super(code, message, statusCode, metadata);
  }
}

export class UnauthorizedMessageAccessError extends MessageError {
  constructor(metadata?: Record<string, unknown>) {
    super(MessageErrorCode.UNAUTHORIZED_ACCESS, 'Unauthorized access to message', 403, metadata);
  }
}

export class MessageDeliveryError extends MessageError {
  constructor(metadata?: Record<string, unknown>) {
    super(MessageErrorCode.DELIVERY_FAILED, 'Failed to mark messages as delivered', 400, metadata);
  }
}

export class WebSocketAuthError extends MessageError {
  constructor(metadata?: Record<string, unknown>) {
    super(MessageErrorCode.WEBSOCKET_AUTH_FAILED, 'WebSocket authentication failed', 401, metadata);
  }
}
