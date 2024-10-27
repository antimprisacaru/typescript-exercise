import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../auth/auth.dto';
import { AggregatedConversationListItem } from './conversation.interfaces';

export class ConversationDto {
  @ApiProperty({
    example: '5f7d3e2b-1f9c-4e6a-8a0b-6d1f3c7d8e9a',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    type: UserDto,
    description: `User who isnt current user and is participating in the conversation`,
  })
  participant: UserDto;

  @ApiProperty({
    type: String,
    description: 'Last message sent in this conversation',
  })
  lastMessage: string;

  @ApiProperty({
    example: '2024-10-26T15:06:08.839Z',
    description: 'Timestamp at which last message was sent',
  })
  lastTimestamp: string;

  constructor(input: AggregatedConversationListItem) {
    this.id = input.id;
    this.participant = new UserDto(input.participant);
    this.lastMessage = input.lastMessage;
    this.lastTimestamp = input.lastTimestamp;
  }
}
