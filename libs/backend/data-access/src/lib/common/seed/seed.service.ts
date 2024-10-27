import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSeed } from '../../user/user.seed';
import { ConversationSeed } from '../../conversations/conversation.seed';
import { MessageSeed } from '../../message/message.seed';
import { BaseSeed } from './base.seed';

@Injectable()
export class SeedService {
  private readonly seeds: BaseSeed[];

  constructor(
    @OgmaLogger(SeedService.name) private readonly logger: OgmaService,
    private readonly prisma: PrismaService,
    userSeed: UserSeed,
    conversationSeed: ConversationSeed,
    messageSeed: MessageSeed
  ) {
    this.seeds = [userSeed, conversationSeed, messageSeed];
  }

  async seed() {
    const userCount = await this.prisma.user.count();

    if (userCount === 0) {
      this.logger.log('Database is empty, running seeders...');
      try {
        for (const item of this.seeds) {
          await item.seed();
        }
        this.logger.log('Seeding completed successfully');
      } catch (error) {
        this.logger.error('Seeding failed', JSON.stringify(error));
      }
    }
  }
}
