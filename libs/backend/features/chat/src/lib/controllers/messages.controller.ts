import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto, MessageInputDto } from '@typescript-exercise/backend/data-access/message/message.dto';
import { AuthGuard } from '@typescript-exercise/backend/core/guards/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserDecoderService } from '@typescript-exercise/backend/core/services/user-decoder.service';
import { GetSession } from '@typescript-exercise/backend/core/decorators/session.decorator';

@ApiTags('Messages')
@Controller()
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService, private readonly userDecoderService: UserDecoderService) {}

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get a list of messages' })
  @ApiResponse({ status: HttpStatus.OK, type: [MessageDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAll(@Param('conversationId') conversationId: string): Promise<MessageDto[]> {
    // TODO: check user perms on this conversation
    return this.messagesService.getMessagesByConversationId(conversationId).then((result) => result.map((i) => new MessageDto(i)));
  }

  @Post('conversations/:conversationId/send')
  @ApiOperation({ summary: 'Add a new message' })
  @ApiResponse({ status: HttpStatus.OK, type: [MessageDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async addMessage(
    @GetSession() session: SessionContainer,
    @Param('conversationId') conversationId: string,
    @Body() input: MessageInputDto
  ) {
    const user = await this.userDecoderService.decode(session);
    return this.messagesService.addMessage(conversationId, user.id, input);
  }
}
