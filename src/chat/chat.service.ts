import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatHistory } from './entities/ChatHistory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/Message.entity';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { InitiateChatDto } from './dto/InitiateChat.dto';
import { GetChatMessagesDto } from './dto/GetChatMessages.dto';
import { GetChatMessagesResponseDto } from './dto/GetChatMessagesResponse.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async initiateChat(dto: InitiateChatDto): Promise<ChatHistory> {
    const { users } = dto;

    const userRecords = await this.userService.getUsersByIds(users);

    return await this.chatHistoryRepository.save({
      users: userRecords,
    });
  }

  async sendMessage(dto: CreateMessageDto): Promise<Message> {
    const { chatHistoryId, userId, text } = dto;

    return await this.messageRepository.save({
      chatHistory: { id: chatHistoryId },
      user: { id: userId },
      text,
    });
  }

  async getChatMessages(dto: GetChatMessagesDto): Promise<Message[]> {
    const { chatHistoryId, page, limit } = dto;

    return await this.messageRepository.find({
      where: {
        chatHistory: { id: chatHistoryId },
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getChatLastMessage(chatHistoryId: number): Promise<Message> {
    return await this.messageRepository.findOne({
      where: {
        chatHistory: { id: chatHistoryId },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getUserChats(userId: number): Promise<GetChatMessagesResponseDto[]> {
    const user = await this.userService.getUserById(userId, { chats: true });

    const chats: GetChatMessagesResponseDto[] = [];

    for (const chat of user.chats) {
      const lastMessage = await this.getChatLastMessage(chat.id);

      chats.push({ ...chat, lastMessage });
    }

    return chats;
  }
}
