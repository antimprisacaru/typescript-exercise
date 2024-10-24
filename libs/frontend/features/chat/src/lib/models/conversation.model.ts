import { ConversationDto } from '@typescript-exercise/data-access/conversations/conversations-api.interfaces';
import { UserModel } from '@typescript-exercise/core/models/user.model';

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
