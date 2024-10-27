import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConversationsService } from '../services/conversations.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationDto } from '@typescript-exercise/backend/data-access/conversations/conversation.dto';
import { GetSession } from '@typescript-exercise/backend/core/decorators/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserDecoderService } from '@typescript-exercise/backend/core/services/user-decoder.service';
import { AuthGuard } from '@typescript-exercise/backend/core/guards/auth.guard';

@ApiTags('Conversations')
@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService, private readonly userDecoderService: UserDecoderService) {}

  @ApiOperation({ summary: 'Get all conversations' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of conversations',
    type: [ConversationDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAll(@GetSession() session: SessionContainer): Promise<ConversationDto[]> {
    const user = await this.userDecoderService.decode(session);
    return this.conversationsService.getAllConversations(user.id).then((result) => result.map((i) => new ConversationDto(i)));
  }

  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns conversation details',
    type: ConversationDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @Get(':id')
  async getById(@GetSession() session: SessionContainer, @Param(':conversationId') conversationId: string): Promise<ConversationDto> {
    const user = await this.userDecoderService.decode(session);
    return this.conversationsService.getConversationById(user.id, conversationId).then((result) => new ConversationDto(result));
  }

  @ApiOperation({ summary: 'Mark messages as delivered' })
  @ApiResponse({ status: 200, description: 'Messages marked as delivered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post(':conversationId/deliver')
  async markMessagesAsDelivered(@Param('conversationId') conversationId: string, @GetSession() session: SessionContainer) {
    const user = await this.userDecoderService.decode(session);
    await this.conversationsService.getConversationById(user.id, conversationId);
    await this.conversationsService.markMessagesAsDelivered(conversationId, user.id);
  }
}
