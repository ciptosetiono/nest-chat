import { io, Socket } from 'socket.io-client';
import { setupE2E, closeE2E,  createTestUser, validUser} from './setup-e2e'; // Import your setup
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateRoomDto } from '../src/room/dto';
import { RoomType } from '../src/room/room.schema';
import * as fs from 'fs';
import * as path from 'path';

let app: INestApplication;
let server: any;
let clientSocket: Socket;
let port: number;
let jwtAccessToken: string;
let roomId;

export const createRoomDto: CreateRoomDto = {
  name: 'Test Room',
  members: [validUser.username],
  type: RoomType.PERSONAL
}


describe('WebSocket E2E Test', () => {
  beforeAll(async () => {
    // Start NestJS app & MongoDB
    const setup = await setupE2E();
    app = setup.app;

    server = setup.server;
    port = setup.port;

    //Register test user and get access token
    const testUser = await createTestUser(server);
    jwtAccessToken = testUser.accessToken;

    // Create a test room and get the roomId before running other tests
    const response = await request(server)
      .post('/rooms/create')
      .set('Authorization', `Bearer ${jwtAccessToken}`)
      .send(createRoomDto)
      .expect(201);
    roomId = response.body._id.toString();

    await new Promise<void>((resolve, reject) => {
      clientSocket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
        auth: { token: jwtAccessToken },
      });

      clientSocket.on('connect', () => {
        resolve();
      });

      clientSocket.on('connect_error', (err) => {
        reject(new Error(`Failed to connect: ${err.message}`));
      });
    });
  });

  beforeEach(() => {
    clientSocket.removeAllListeners(); // Clear all previous listeners before each test
  });
  

  afterAll(async () => {
    clientSocket.disconnect();
    clientSocket.close();
    await closeE2E();
  });
  
  it('Should NOT allow join room without valid JWT Token', (done) => {

    const invalidClientSocket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      auth: { token: 'invalid-token'},
    });

    //try to join room, succes expected
    invalidClientSocket.on('connect', () => {
      invalidClientSocket.emit('joinRoom', { roomId:roomId });
      done();
    });
    
    //receive auth_error from the gateway
    invalidClientSocket.on('auth_error', (err) => {
      expect(err.message).toContain('Unauthorized'); // Expected error from guard
      done();
    });
    
  });
  
  it('should allow user to join room and receive old messages', (done) => {
    //try join room
    clientSocket.emit('joinRoom', { roomId:roomId });

    //receive the old messages
    clientSocket.on('oldMessages', (data) => {
      expect(data.messages).toBeInstanceOf(Array);
      done();
    });
  });

  it('should allow authenticated user to load more messages', (done) => {
     
    // Emit `loadMessages` with pagination info
    const paginationDto = {
      roomId: roomId,
      page: 1, // Assume pagination starts from 1
      limit: 10, // Load 10 messages
    };
  
    clientSocket.emit('loadMessages', paginationDto);
    // Expect to receive messages
    clientSocket.on('oldMessages', (data) => {
        expect(data.messages).toBeInstanceOf(Array);
        expect(data.totalMessages).toBeDefined();
        done();
      });
  });
     
  it('should allow user to send text message and receive back the message', (done) => {
    clientSocket.emit('joinRoom', { roomId: roomId });

    const messageDto = {
      roomId: roomId,
      content: 'Hello, this is a test message!',
    };

    clientSocket.emit('sendMessage', messageDto);

    //Expect to receive the message
    clientSocket.once('receiveMessage', (message) => {
      expect(message.content).toBe(messageDto.content);
      expect(message.roomId).toBe(roomId);
      done();
    });
  });
  
  it('Should allow user to send a chat file and receive back the chat file', (done) => {
    clientSocket.emit('joinRoom', { roomId:roomId });

    const filename = 'test-file.jpeg';
    const imagePath = path.join(__dirname, 'assets', filename);
    const imageBuffer = fs.readFileSync(imagePath); // Read image as Buffer

    clientSocket.emit('sendFile',{
        file: imageBuffer,
        filename: filename,
        mimetype: 'image/jpeg',
        roomId: roomId,
    });
    
    clientSocket.once('receiveMessage', (message) => {
      expect(message.roomId.toString()).toEqual(roomId);
      expect(message.content).toEqual(filename);
      expect(message.files.length).toBeGreaterThanOrEqual(1);
      done();
    });
  });
  
});
