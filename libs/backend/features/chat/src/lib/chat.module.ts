import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { MessagesController } from './controllers/messages.controller';
import { ConversationsService } from './services/conversations.service';
import { MessagesService } from './services/messages.service';
import { DataAccessModule } from '@typescript-exercise/backend/data-access/data-access.module';
import { CoreModule } from '@typescript-exercise/backend/core/core.module';

@Module({
  imports: [DataAccessModule, CoreModule],
  controllers: [ConversationsController, MessagesController],
  providers: [ConversationsService, MessagesService],
})
export class ChatModule {}
