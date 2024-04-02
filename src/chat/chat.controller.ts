import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { InitiateChatDto } from './dto/InitiateChat.dto';
import { CreateMessageDto } from './dto/CreateMessage.dto';

@Controller('chat')
export class ChatController {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('initiateChat')
  async handleInitiateChat(
    @MessageBody() initiateChatDto: InitiateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chatHistory = await this.chatService.initiateChat(initiateChatDto);

    this.server.emit('chatInitiated', chatHistory as any);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const message = await this.chatService.sendMessage(createMessageDto);

    this.server
      .to(`chat-${createMessageDto.chatHistoryId}`)
      .emit('newMessage', message);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody('chatHistoryId') chatHistoryId: number,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`chat-${chatHistoryId}`);
  }
}
