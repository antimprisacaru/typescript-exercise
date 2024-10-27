import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { rand, randBetweenDate, randNumber, randParagraph, randPastDate } from '@ngneat/falso';
import { BaseSeed } from '../common/seed/base.seed';

@Injectable()
export class MessageSeed implements BaseSeed {
  constructor(private readonly prisma: PrismaService, @OgmaLogger(MessageSeed.name) private readonly logger: OgmaService) {}

  async seed(): Promise<void> {
    const conversations = await this.prisma.conversation.findMany({
      include: { participants: true },
    });

    for (const conversation of conversations) {
      const numberOfMessages = randNumber({ min: 5, max: 20 });
      let lastDate = randPastDate();
      const now = new Date();

      for (let i = 0; i < numberOfMessages; i++) {
        const sender = rand(conversation.participants);

        try {
          const message = await this.prisma.message.create({
            data: {
              text: randParagraph(),
              status: 'RECEIVED',
              senderId: sender.id,
              conversationId: conversation.id,
              createdAt: randBetweenDate({ from: lastDate, to: now }),
            },
          });
          lastDate = message.createdAt;

          this.logger.debug(`Created message ${message.id} in conversation ${conversation.id}`);
        } catch (error) {
          this.logger.error(`Failed to create message`, JSON.stringify(error));
        }
      }

      this.logger.info(`Created ${numberOfMessages} messages in conversation ${conversation.id}`);
    }
  }

  async clean(): Promise<void> {
    this.logger.info('Cleaning up messages...');
    await this.prisma.message.deleteMany();
  }
}
