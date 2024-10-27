import { Module } from '@nestjs/common';
import { DataAccessModule } from './data-access.module';
import { UserSeed } from './user/user.seed';
import { ConversationSeed } from './conversations/conversation.seed';
import { MessageSeed } from './message/message.seed';
import { SeedService } from './common/seed/seed.service';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [DataAccessModule, OgmaModule.forFeatures([UserSeed.name, ConversationSeed.name, MessageSeed.name, SeedService.name])],
  providers: [UserSeed, ConversationSeed, MessageSeed, SeedService],
  exports: [SeedService],
})
export class SeedModule {}
