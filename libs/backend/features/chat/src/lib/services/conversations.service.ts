import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '@typescript-exercise/backend/data-access/conversations/conversation.repository';
import { AggregatedConversationListItem } from '@typescript-exercise/backend/data-access/conversations/conversation.interfaces';

@Injectable()
export class ConversationsService {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async getAllConversations(userId: string): Promise<AggregatedConversationListItem[]> {
    const result = await this.conversationRepository.getAllConversations(userId);

    return result.map((i) => ({
      id: i.id,
      participant: i.participants.find((participant) => participant.id !== userId)!,
      lastMessage: i.messages[0].text,
      lastTimestamp: i.messages[0].createdAt.toISOString(),
    }));
  }

  async getConversationById(userId: string, conversationId: string): Promise<AggregatedConversationListItem> {
    const result = await this.conversationRepository.getConversationById(userId, conversationId);

    return {
      id: result.id,
      participant: result.participants.find((participant) => participant.id !== userId)!,
      lastMessage: result.messages[0].text,
      lastTimestamp: result.messages[0].createdAt.toISOString(),
    };
  }
}
