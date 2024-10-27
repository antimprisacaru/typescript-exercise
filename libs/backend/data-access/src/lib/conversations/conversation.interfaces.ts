import { User } from '@prisma/client';

export interface AggregatedConversationListItem {
  id: string;
  participant: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'>;
  lastMessage: string;
  lastTimestamp: string;
}
