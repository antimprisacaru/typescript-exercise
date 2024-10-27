import { Injectable } from '@nestjs/common';
import { AggregatedMessageListItem } from '@typescript-exercise/backend/data-access/message/message.interfaces';
import { MessageRepository } from '@typescript-exercise/backend/data-access/message/message.repository';

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
}
