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
      origin: '*', // allow all sources
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
 
    //handle send message
    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() dto: CreateChatDto, @ConnectedSocket() client: Socket) {
    
      //get senderId from request
      const senderId = client.data.user._id;

      //save the message
      const chat = await this.chatService.createChat(senderId, dto);

      //send message to all clients based on room
      this.server.to(dto.room).emit('receiveMessage', chat);
      
    }
 
    //handle join chat room
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
      @MessageBody()  getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {

      //joint room
      client.join(getChatDto.roomId);

      // ✅ Fetch Old Messages by roomId and pagination
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);
      
      //send the messages to client
      client.emit('oldMessages', { messages, totalMessages });

    }

    //handle load more messages
    @SubscribeMessage('loadMessages')
    async loadMessages(
      @MessageBody() getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {
       // ✅ Fetch Old Messages by roomId and chat pagination
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);
      
      //send the messages to client
      client.emit('oldMessages', { messages, totalMessages });
    }

  }