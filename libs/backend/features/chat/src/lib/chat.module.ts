import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { MessagesController } from './controllers/messages.controller';
import { ConversationsService } from './services/conversations.service';
import { MessagesService } from './services/messages.service';
import { DataAccessModule } from '@typescript-exercise/backend/data-access/data-access.module';
import { CoreModule } from '@typescript-exercise/backend/core/core.module';
import { MessageGateway } from './gateways/message.gateway';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [DataAccessModule, CoreModule, OgmaModule.forFeatures([MessageGateway.name, ConversationsService.name, MessagesService.name])],
  controllers: [ConversationsController, MessagesController],
  providers: [ConversationsService, MessagesService, MessageGateway],
  exports: [MessageGateway],
})
export class ChatModule {}
