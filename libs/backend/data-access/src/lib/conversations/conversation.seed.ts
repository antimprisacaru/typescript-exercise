import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseSeed } from '../common/seed/base.seed';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { flatMap, range } from 'lodash';

@Injectable()
export class ConversationSeed implements BaseSeed {
  constructor(private readonly prisma: PrismaService, @OgmaLogger(ConversationSeed.name) private readonly logger: OgmaService) {}

  async seed(): Promise<void> {
    // Get all users
    const users = await this.prisma.user.findMany();

    // Generate all possible pairs of users using flatMap
    const userPairs = flatMap(range(users.length - 1), (i) => range(i + 1, users.length).map((j) => [users[i], users[j]]));

    // Create a conversation for each pair
    for (const [user1, user2] of userPairs) {
      try {
        const conversation = await this.prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: user1.id }, { id: user2.id }],
            },
          },
        });

        this.logger.info(`Created conversation ${conversation.id} between users ${user1.id} and ${user2.id}`);
      } catch (error) {
        this.logger.error(`Failed to create conversation between users ${user1.id} and ${user2.id}`, JSON.stringify(error));
      }
    }
  }

  async clean(): Promise<void> {
    this.logger.info('Cleaning up conversations...');
    await this.prisma.conversation.deleteMany();
  }
}
