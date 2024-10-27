import { MessageDto, MessageInputDto, MessageStatus } from '../messages/messages-api.interfaces';
import { rand, randPastDate, randSentence, randUuid } from '@ngneat/falso';
import { ConversationDto } from './conversations-api.interfaces';
import { UserDto } from '../users/users-api.interfaces';
import { DEFAULT_USER, users } from '../users/users-data.mock';
import { maxBy } from 'lodash';

type ConversationMock = ConversationDto & { messages: MessageDto[] };

export const conversations: ConversationMock[] = Array.from({ length: 30 }).map(() => {
  const base: Omit<ConversationDto, 'lastMessage' | 'lastTimestamp'> = {
    id: randUuid(),
    participant: rand(users),
  };
  const messages = Array.from({ length: 30 }).map(() => generateMessage(base.participant));
  const lastMessage = maxBy(messages, (m) => new Date(m.timestamp))!;

  return {
    ...base,
    lastMessage: lastMessage.text,
    lastTimestamp: lastMessage.timestamp,
    messages,
  } satisfies ConversationMock;
});

function generateMessage(participant: UserDto): MessageDto {
  return {
    id: randUuid(),
    text: randSentence(),
    status: rand(Object.values(MessageStatus)),
    sender: participant,
    timestamp: randPastDate().toISOString(),
  };
}

export function getMessages(conversationId: string): MessageDto[] | undefined {
  const conversationIdx = conversations.findIndex((i) => i.id === conversationId);
  if (!conversationIdx) {
    return undefined;
  }
  return conversations[conversationIdx].messages;
}

export function addMessage(conversationId: string, input: MessageInputDto): MessageDto | undefined {
  const conversationIdx = conversations.findIndex((i) => i.id === conversationId);

  if (!conversationIdx) {
    return undefined;
  }

  const newMessage: MessageDto = {
    ...input,
    id: randUuid(),
    timestamp: new Date().toISOString(),
    status: rand(Object.values(MessageStatus)),
    sender: rand([conversations[conversationIdx].participant, DEFAULT_USER]),
  };
  conversations[conversationIdx].messages.push(newMessage);
  conversations[conversationIdx].lastMessage = newMessage.text;
  return newMessage;
}
