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
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { FileService } from '../file/file.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { WsJwtGuard } from '../auth/guard/ws-jwt.guard'; 
import { UseGuards } from '@nestjs/common';
import { GetChatDto } from './dto/get-chat.dto';


  @WebSocketGateway({
    namespace: '',
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
      //console.log('WebSocket server initialized');
    }
 
    async handleConnection(client: Socket) {
     // console.log('New connection attempt');
    }
 
    handleDisconnect(client: Socket) {
     // console.log(`User ${client.data.user?.username || 'unknown'} disconnected`)
    }

     /**
     * Handles the event when a client joins a chat room.
     * 
     * @param getChatDto - Data transfer object containing the room ID and other chat details.
     * @param client - The socket client that is joining the room.
     * 
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     * 
     * @description
     * This method performs the following actions:
     * 1. Joins the client to the specified chat room.
     * 2. Fetches old chat messages from the chat service.
     * 3. Emits the fetched messages back to the client.
     */
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
      @MessageBody()  getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {

      //joint room
      client.join(getChatDto.roomId);

      //fetch old messages
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);   
      
      //send the old messages to client
      client.emit('oldMessages', { messages, totalMessages });

    }

     /**
     * Loads old chat messages based on the provided chat details and sends them to the client.
     *
     * @param getChatDto - Data transfer object containing chat details such as roomId and pagination info.
     * @param client - The connected socket client to which the messages will be sent.
     * @returns A promise that resolves when the messages have been successfully sent to the client.
     */
    @SubscribeMessage('loadMessages')
    async loadMessages(
      @MessageBody() getChatDto: GetChatDto,
      @ConnectedSocket() client: Socket
    ) {
        //etch Old Messages by roomId and chat pagination
      const { messages, totalMessages } = await this.chatService.getChats(getChatDto);
      
      //send the messages to client
      client.emit('oldMessages', { messages, totalMessages });
    }
    
    /**
     * Handles incoming chat messages from connected clients.
     * 
     * @param client - The socket client that sent the message.
     * @param dto - The data transfer object containing the message details.
     * 
     * @returns A promise that resolves when the message has been handled.
     * 
     * @remarks
     * This method retrieves the sender's ID from the client's data, saves the message using the chat service,
     * and emits the message to all clients in the specified room.
     */
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

    /**
     * Handle Incomming File Chat Message from client
     * @param client 
     * @param data - the file data  and roomId
     * @description
     * this method performing following actions:
     * 1. get the client userId
     * 2. reading file that send by client
     * 3. create unique filename for the file
     * 4. Upload file
     * 5. save the file data in DB as File model and push it to Chat model
     * 6. Send the Chat Model to All Client Based On the RoomId.
     */
    @SubscribeMessage('sendFile')
    async handleSendFile(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { file: ArrayBuffer; filename: string; mimetype: string; roomId: string;}
    ) {

      const userId = client.data.user._id;

      const buffer = Buffer.from(data.file);

      // Generate unique filename
      const uniqueFilename = `${uuidv4()}-${data.filename}`;
      const uploadPath = `./uploads/${uniqueFilename}`;

      // Save file locally
      await fs.promises.writeFile(uploadPath, buffer);
      
      try {
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
       } catch (error) {
        //console.log(error);
       }
    }


  }