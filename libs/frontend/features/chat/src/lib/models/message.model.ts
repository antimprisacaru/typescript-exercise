import { MessageDto, MessageStatus } from '@typescript-exercise/frontend/data-access/messages/messages-api.interfaces';
import { UserModel } from '@typescript-exercise/frontend/core/models/user.model';

export class MessageModel {
  id: string;
  text: string;
  status: MessageStatus;
  sender: UserModel;
  timestamp: Date;

  constructor({ id, text, status, sender, timestamp }: MessageDto) {
    this.id = id;
    this.text = text;
    this.status = status;
    this.sender = new UserModel(sender);
    this.timestamp = new Date(timestamp);
  }
}
