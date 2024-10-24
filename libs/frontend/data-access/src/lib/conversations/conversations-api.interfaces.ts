import { UserDto } from '../users/users-api.interfaces';

export interface ConversationDto {
  id: string;
  participants: UserDto[];
  lastMessage: string;
  lastTimestamp: string;
}
