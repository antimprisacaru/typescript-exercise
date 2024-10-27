import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../auth/auth.dto';
import { AggregatedMessageListItem } from './message.interfaces';

export const MessageStatus = {
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export class MessageDto {
  @ApiProperty({
    example: '5f7d3e2b-1f9c-4e6a-8a0b-6d1f3c7d8e9a',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'bla',
    description: 'Text content of message',
  })
  text: string;

  @ApiProperty({
    example: MessageStatus.SENT,
    description: 'Status of message',
  })
  status: MessageStatus;

  @ApiProperty({
    type: UserDto,
    description: `User who sent the message`,
  })
  sender: UserDto;

  @ApiProperty({
    example: '2024-10-26T15:06:08.839Z',
    description: 'Timestamp at which message was sent',
  })
  timestamp: string;

  constructor(input: AggregatedMessageListItem) {
    this.id = input.id;
    this.text = input.text;
    this.status = input.status;
    this.sender = new UserDto(input.sender);
    this.timestamp = input.timestamp;
  }
}
