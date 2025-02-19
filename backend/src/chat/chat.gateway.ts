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
import { FileService } from 'src/file/file.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { WsJwtGuard } from 'src/auth/guard/ws-jwt.guard'; 
import { UseGuards } from '@nestjs/common';
import { GetChatDto } from './dto/get-chat.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

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
      private readonly chatService: ChatService,
      private readonly fileService: FileService
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

 
    //handle send message
    @SubscribeMessage('sendMessage')
    async handleMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() dto: CreateChatDto,
    ) {
    
      //get senderId from request
      const senderId = client.data.user._id;

      //save the message
      const chat = await this.chatService.createChat(senderId, dto);

      //send message to all clients based on room
      this.server.to(dto.room).emit('receiveMessage', chat);
    }


    //handle send file
    @SubscribeMessage('sendFile')
    async handleSendFile(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { file: ArrayBuffer; filename: string; mimetype: string; roomId: string;}
    ) {

      //get senderId from request
      const userId = client.data.user._id;

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(data.file);

      // Generate unique filename
      const uniqueFilename = `${uuidv4()}-${data.filename}`;
      const uploadPath = `./uploads/${uniqueFilename}`;

      // Save file locally
      await fs.promises.writeFile(uploadPath, buffer);

       // 4️⃣ Store file metadata in MongoDB
      const newChat = await this.fileService.uploadFile(
        userId,
        data.roomId,
        {
          filename:uniqueFilename,
          originalName: data.filename,
          mimetype: data.mimetype,
          path: `/uploads/${uniqueFilename}`,
        }
      );
            
      //send message to all clients based on room
      this.server.to(data.roomId).emit('receiveMessage', newChat);
      
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