import { UserDto } from '../users/users-api.interfaces';

export interface ConversationDto {
  id: string;
  participant: UserDto;
  lastMessage: string;
  lastTimestamp: string;
}
