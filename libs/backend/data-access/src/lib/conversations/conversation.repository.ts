import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(protected readonly prisma: PrismaService) {}

  getAllConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            text: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  getConversationById(userId: string, conversationId: string) {
    return this.prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            text: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
