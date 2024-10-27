import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageError, MessageErrorCode, WebSocketAuthError } from '@typescript-exercise/backend/data-access/message/message.errors';
import { WebSocketEvents } from '@typescript-exercise/backend/data-access/conversations/conversation.events';
import { ConversationsService } from '../services/conversations.service';
import { ConversationAccessError } from '@typescript-exercise/backend/data-access/conversations/conversation.errors';
import Session from 'supertokens-node/recipe/session';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@WebSocketGateway()
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private readonly connectedClients = new Map<string, string>();

  constructor(
    @OgmaLogger(MessageGateway.name) private readonly logger: OgmaService,
    private readonly conversationsService: ConversationsService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      const userId = await this.authenticateClient(token);

      this.connectedClients.set(client.id, userId);
      client.data.userId = userId;

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.handleError(client, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(WebSocketEvents.JOIN_CONVERSATION)
  async handleJoinConversation(client: Socket, conversationId: string) {
    try {
      await this.verifyConversationAccess(client.data.userId, conversationId);
      await this.joinConversationRoom(client, conversationId);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @SubscribeMessage(WebSocketEvents.LEAVE_CONVERSATION)
  async handleLeaveConversation(client: Socket, conversationId: string) {
    try {
      await client.leave(conversationId);
      this.logger.log(`Client ${client.id} left conversation ${conversationId}`);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @SubscribeMessage(WebSocketEvents.MARK_DELIVERED)
  async handleMarkDelivered(client: Socket, conversationId: string) {
    try {
      await this.verifyConversationAccess(client.data.userId, conversationId);
      await this.conversationsService.markMessagesAsDelivered(conversationId, client.data.userId);

      this.server.to(conversationId).emit(WebSocketEvents.MESSAGES_DELIVERED, {
        conversationId,
        deliveredBy: client.data.userId,
      });
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @SubscribeMessage(WebSocketEvents.NEW_MESSAGE)
  async handleNewMessage(client: Socket, payload: { text: string }) {
    try {
      // Get the current conversation room
      const conversationId = [...client.rooms].find((room) => room !== client.id);
      if (!conversationId) {
        throw new Error('Client not in any conversation room');
      }

      // Verify access first
      await this.verifyConversationAccess(client.data.userId, conversationId);

      // If access is verified, broadcast the message
      this.server.to(conversationId).emit(WebSocketEvents.NEW_MESSAGE, {
        text: payload.text,
      });
    } catch (error) {
      this.handleError(client, error);
    }
  }

  // Private helper methods
  private extractToken(client: Socket): string {
    const token = client.handshake.auth['token'] || client.handshake.headers.authorization;

    if (!token) {
      throw new WebSocketAuthError({
        socketId: client.id,
        reason: 'No authentication token provided',
      });
    }

    return token;
  }

  private async authenticateClient(token: string): Promise<string> {
    const session = await Session.getSessionWithoutRequestResponse(token, undefined, {
      sessionRequired: true,
      antiCsrfCheck: false,
      checkDatabase: true,
    });

    if (!session) {
      throw new WebSocketAuthError({
        reason: 'Invalid session',
      });
    }

    return session.getUserId();
  }

  private async verifyConversationAccess(userId: string, conversationId: string): Promise<void> {
    try {
      await this.conversationsService.getConversationById(userId, conversationId);
    } catch (error) {
      this.logger.error(`Access denied to conversation ${conversationId} for user ${userId}`, JSON.stringify(error));
      throw new ConversationAccessError({
        userId,
        conversationId,
        reason: 'User does not have access to this conversation',
      });
    }
  }

  private async joinConversationRoom(client: Socket, conversationId: string): Promise<void> {
    // Leave all other rooms except the socket's own room
    const rooms = [...client.rooms];
    await Promise.all(
      rooms.map((room) => {
        if (room !== client.id) {
          return client.leave(room);
        }
      })
    );

    // Join new room
    await client.join(conversationId);
    this.logger.log(`Client ${client.id} joined conversation ${conversationId}`);
  }

  private handleError(client: Socket, error: unknown): void {
    if (error instanceof WebSocketAuthError) {
      this.logger.error(`Authentication error for client ${client.id}: ${error.message}`);
    } else if (error instanceof ConversationAccessError) {
      this.logger.error(`Conversation access error: ${error.message}`, error.metadata);
    } else {
      this.logger.error('Unexpected error:', JSON.stringify(error));
    }

    client.emit(WebSocketEvents.ERROR, {
      code: error instanceof MessageError ? error.code : MessageErrorCode.CONNECTION_ERROR,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
}
