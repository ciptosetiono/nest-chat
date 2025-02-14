import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { WsJwtGuard } from 'src/auth/guard/ws-jwt.guard'; 
import { UseGuards } from '@nestjs/common';
import { GetChatDto } from './dto/get-chat.dto';

  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000', // Sesuaikan dengan frontend Anda
      credentials: true,
    },
  })
  @UseGuards(WsJwtGuard)
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    
 
    constructor(
      private readonly chatService: ChatService
    ) {}
 
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
 
    async handleConnection(client: Socket) {
      console.log(`User ${client.data.user?.username || 'unknown'} connected`);
    }
 
    handleDisconnect(client: Socket) {
      console.log(`User ${client.data.user?.username || 'unknown'} disconnected`)
    }
 

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() dto: CreateChatDto, @ConnectedSocket() client: Socket) {
    
      //get sender_id from request
      const senderId = client.data.user._id;

      const chat = await this.chatService.createChat(senderId, dto);
      console.log('send back the chat to');
      this.server.to(dto.room).emit('receiveMessage', chat);
      
    }
 
    //handle join chat room
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
      @MessageBody()  getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {
      console.log(`User join room`);
      //joint client
      client.join(getChatDto.roomId);

      console.log(getChatDto);

      // ✅ Fetch Old Messages by roomId and chat pagination
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);
      client.emit('oldMessages', { messages, totalMessages });

    }

    @SubscribeMessage('loadMessages')
    async loadMessages(
      @MessageBody() getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {

      console.log(getChatDto);
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);
      client.emit('oldMessages', { messages, totalMessages });
    }

  }