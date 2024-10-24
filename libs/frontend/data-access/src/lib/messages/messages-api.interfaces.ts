import { UserDto } from '../users/users-api.interfaces';

export interface MessageDto {
  id: string;
  text: string;
  status: MessageStatus;
  sender: UserDto;
  timestamp: string;
}

export interface MessageInputDto {
  text: string;
}

export enum MessageStatus {
  Sent = 'sent',
  Received = 'received',
}
