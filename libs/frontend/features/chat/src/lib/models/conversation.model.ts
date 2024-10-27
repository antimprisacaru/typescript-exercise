import { ConversationDto } from '@typescript-exercise/frontend/data-access/conversations/conversations-api.interfaces';
import { UserModel } from '@typescript-exercise/frontend/core/models/user.model';

export class ConversationModel {
  id: string;
  participant: UserModel;
  lastMessage: string;
  lastTimestamp: Date;

  constructor({ id, participant, lastMessage, lastTimestamp }: ConversationDto) {
    this.id = id;
    this.participant = new UserModel(participant);
    this.lastMessage = lastMessage;
    this.lastTimestamp = new Date(lastTimestamp);
  }
}
