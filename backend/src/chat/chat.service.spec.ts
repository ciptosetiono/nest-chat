import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { DefaultPagination } from 'src/common/const/default-pagination';
import { Model, Types } from 'mongoose';
import { Room, RoomType } from '../room/room.schema';
import { User } from 'src/user/user.schema';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<ChatDocument>;

  const mockChatModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    populate: jest.fn(),
  };


  
  const mockUser: User = {
      _id: new Types.ObjectId('60d0fe4f5311236168a109cc'),
      username: 'testuser1',
      email: 'testmail',
      name: '',
      hash: '',
      hosroscope: '',
      zodiac: '',
      interests: []
  }


  const mockRoom: Room = {
    name: 'Test Room',
    type: RoomType.PERSONAL,
    members: [mockUser],
  }

  const mockChat: Chat = {
    room: mockRoom,
    sender: mockUser,
    content: 'Hello, world!'
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
    chatModel = module.get<Model<ChatDocument>>(getModelToken(Chat.name));
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

      const savedChat = {
        ...mockChat,
        populate: jest.fn().mockResolvedValue(mockChat),
      };

      jest.spyOn(chatModel.prototype, 'save').mockResolvedValue(savedChat as any);

      const result = await service.createChat(mockChat.sender, createChatDto);

      expect(result).toEqual(mockChat);
      expect(chatModel.prototype.save).toHaveBeenCalled();
    });
  });

  describe('getChats', () => {
    it('should return chats with pagination', async () => {
      const getChatDto: GetChatDto = {
        roomId: '60d0fe4f5311236168a109cb',
        page: 1,
        limit: 10,
      };

      const chats = [mockChat];
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

    it('should use default pagination values if not provided', async () => {
      const getChatDto: GetChatDto = {
        roomId: '60d0fe4f5311236168a109cb',
      };

      const chats = [mockChat];
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