import { ConversationDto } from '@typescript-exercise/frontend/data-access/conversations/conversations-api.interfaces';
import { UserModel } from '@typescript-exercise/frontend/core/models/user.model';

export class ConversationModel {
  id: string;
  participants: UserModel[];
  lastMessage: string;
  lastTimestamp: Date;

  constructor({ id, participants, lastMessage, lastTimestamp }: ConversationDto) {
    this.id = id;
    this.participants = participants.map((p) => new UserModel(p));
    this.lastMessage = lastMessage;
    this.lastTimestamp = new Date(lastTimestamp);
  }
}
