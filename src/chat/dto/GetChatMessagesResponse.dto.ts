import { ChatHistory } from '../entities/ChatHistory.entity';
import { IsInstance } from 'class-validator';
import { Message } from '../entities/Message.entity';

export class GetChatMessagesResponseDto extends ChatHistory {
  @IsInstance(Message)
  lastMessage: Message;
}
