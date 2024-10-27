import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  getMessagesByConversationId(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversation: {
          id: conversationId,
        },
      },
      select: {
        id: true,
        createdAt: true,
        text: true,
        status: true,
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async markConversationMessagesAsDelivered(conversationId: string, userId: string): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        status: 'SENT',
        NOT: {
          senderId: userId, // Don't mark user's own messages as delivered
        },
      },
      data: {
        status: 'RECEIVED',
      },
    });
  }

  async verifyConversationAccess(conversationId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.conversation.count({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });
    return count > 0;
  }

  async addMessage(conversationId: string, userId: string, text: string) {
    return this.prisma.message.create({
      data: {
        text: text,
        status: 'SENT',
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: userId },
        },
      },
      include: {
        sender: true,
      },
    });
  }
}
