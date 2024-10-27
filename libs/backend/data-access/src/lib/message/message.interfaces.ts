import { User } from '@prisma/client';
import { MessageStatus } from './message.dto';

export interface AggregatedMessageListItem {
  id: string;
  sender: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'>;
  text: string;
  status: MessageStatus;
  timestamp: string;
}
