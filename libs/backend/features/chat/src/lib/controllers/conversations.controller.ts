import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ConversationsService } from '../services/conversations.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConversationDto } from '@typescript-exercise/backend/data-access/conversations/conversation.dto';
import { GetSession } from '@typescript-exercise/backend/core/decorators/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserDecoderService } from '@typescript-exercise/backend/core/services/user-decoder.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService, private readonly userDecoderService: UserDecoderService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of conversations' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ConversationDto],
  })
  async getAll(@GetSession() session: SessionContainer): Promise<ConversationDto[]> {
    const user = await this.userDecoderService.decode(session);
    return this.conversationsService.getAllConversations(user.id).then((result) => result.map((i) => new ConversationDto(i)));
  }

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get a conversation by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ConversationDto,
  })
  async getById(@GetSession() session: SessionContainer, @Param(':conversationId') conversationId: string): Promise<ConversationDto> {
    const user = await this.userDecoderService.decode(session);
    return this.conversationsService.getConversationById(user.id, conversationId).then((result) => new ConversationDto(result));
  }
}
