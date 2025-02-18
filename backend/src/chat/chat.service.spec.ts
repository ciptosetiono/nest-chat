import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Model, Types, Document } from 'mongoose';
import { Room, RoomType } from '../room/room.schema';
import { User } from 'src/user/user.schema';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<Chat>;

  const mockUser: User = {
    _id: new Types.ObjectId('60d0fe4f5311236168a109cc'),
    username: 'testuser1',
    email: 'testmail',
    name: '',
    hash: '',
    horoscope: '',
    zodiac: '',
    interests: []
  };

  const mockRoom: Room = {
    name: 'Test Room',
    type: RoomType.PERSONAL,
    members: [mockUser],
  };

  const mockChat: Chat = {
    _id:new Types.ObjectId('60d0fe4f5311236168a109cc'),
    room: mockRoom,
    sender: mockUser,
    content: 'Hello, world!',
    files:[]
  };

  const mockChatDocument = {
    ...mockChat,
    _id: new Types.ObjectId(),
    __v: 0,
    populate: jest.fn().mockResolvedValue(mockChat),
  };

  const mockChatModel = {
    create: jest.fn().mockResolvedValue(mockChatDocument),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockChatDocument]),
    }),
    findOne: jest.fn().mockResolvedValue(mockChatDocument),
    findById: jest.fn().mockResolvedValue(mockChatDocument),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockChatDocument),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockChatDocument),
    countDocuments: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<Chat>>(getModelToken(Chat.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChat', () => {
    it('should create and return a chat message', async () => {
      const createChatDto: CreateChatDto = {
        room: '60d0fe4f5311236168a109cb',
        content: 'Hello, world!',
      };

      jest.spyOn(chatModel, 'create').mockResolvedValue(mockChatDocument as any);

      const result = await service.createChat(mockChat.sender, createChatDto);

      expect(result).toMatchObject({
        content: mockChatDocument.content,
        room: expect.any(Object),
        sender: expect.any(Object),
      });
    });
  });

  describe('getChats', () => {
    it('should return chats with pagination', async () => {
      const getChatDto: GetChatDto = {
        roomId: '60d0fe4f5311236168a109cb',
        page: 1,
        limit: 10,
      };

      const chats = [mockChatDocument];
      const totalChats = 1;

      jest.spyOn(chatModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(chats),
      } as any);

      jest.spyOn(chatModel, 'countDocuments').mockResolvedValue(totalChats);

      const result = await service.getChats(getChatDto);

      expect(result).toEqual({
        messages: chats,
        totalMessages: totalChats,
      });
      expect(chatModel.find).toHaveBeenCalledWith({ room: getChatDto.roomId });
      expect(chatModel.countDocuments).toHaveBeenCalledWith({ room: getChatDto.roomId });
    });
  });
});
