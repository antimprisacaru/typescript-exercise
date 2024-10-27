import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  getMessagesByConversationId(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
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
        createdAt: 'desc',
      },
    });
  }
}
