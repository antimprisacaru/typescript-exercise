import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageDto } from '@typescript-exercise/backend/data-access/message/message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get a list of messages' })
  @ApiResponse({ status: HttpStatus.OK, type: [MessageDto] })
  async getAll(@Param(':conversationId') conversationId: string): Promise<MessageDto[]> {
    return this.messagesService.getMessagesByConversationId(conversationId).then((result) => result.map((i) => new MessageDto(i)));
  }
}
