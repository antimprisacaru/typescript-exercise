import { Injectable } from '@nestjs/common';
import { AggregatedMessageListItem } from '@typescript-exercise/backend/data-access/message/message.interfaces';
import { MessageRepository } from '@typescript-exercise/backend/data-access/message/message.repository';
import { MessageInputDto } from '@typescript-exercise/backend/data-access/message/message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessageRepository) {}

  async getMessagesByConversationId(conversationId: string): Promise<AggregatedMessageListItem[]> {
    const result = await this.messagesRepository.getMessagesByConversationId(conversationId);

    return result.map((i) => ({
      id: i.id,
      sender: i.sender,
      text: i.text,
      status: i.status,
      timestamp: i.createdAt.toISOString(),
    }));
  }

  async addMessage(conversationId: string, userId: string, input: MessageInputDto) {
    const result = await this.messagesRepository.addMessage(conversationId, userId, input.text);

    return {
      id: result.id,
      sender: result.sender,
      text: result.text,
      status: result.status,
      timestamp: result.createdAt.toISOString(),
    };
  }
}
