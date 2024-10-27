import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './user/user.repository';
import { OgmaModule } from '@ogma/nestjs-module';
import { ConversationRepository } from './conversations/conversation.repository';
import { MessageRepository } from './message/message.repository';

@Module({
  imports: [OgmaModule.forFeatures([PrismaService.name])],
  providers: [PrismaService, UserRepository, ConversationRepository, MessageRepository],
  exports: [PrismaService, UserRepository, ConversationRepository, MessageRepository],
})
export class DataAccessModule {}
