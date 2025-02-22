import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Model, Types, Document } from 'mongoose';
import { Room, RoomType } from '../room/room.schema';
import { User } from '../user/user.schema';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<Chat>;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser1',
    email: 'testmail',
    name: '',
    hash: '',
    horoscope: '',
    zodiac: '',
    interests: []
  };

  const mockUserModel= {
    findOne: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  const mockRoom: Room = {
    _id: new Types.ObjectId(),
    name: 'Test Room',
    type: RoomType.PERSONAL,
    members: [mockUser._id],
  };

  const mockRoomModel = {
    find: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockRoom),
    findById: jest.fn().mockResolvedValue(mockRoom),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockRoom)
  };


  const mockChat: Chat = {
    _id:new Types.ObjectId(),
    roomId: mockRoom._id,
    sender: mockUser._id,
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

  const mockFileModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        RoomService,
        UserService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
        {
          provide: getModelToken(Room.name),
          useValue: mockRoomModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('File'),
          useValue: mockFileModel, // Add a mock FileModel
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
        roomId: mockChatDocument._id.toString(),
        content: mockChatDocument.content,
      };

      jest.spyOn(chatModel, 'create').mockResolvedValue(mockChatDocument as any);

      const result = await service.createChat(mockChat.sender.toString(), createChatDto);

      expect(result).toMatchObject({
        content: mockChatDocument.content,
        roomId: mockChatDocument.roomId,
        sender: expect.any(Object),
      });
    });

    it('should return not found for invalid RoomId', async () => {
      const createChatDto: CreateChatDto = {
        roomId: 'invalid-RoomId',
        content: mockChatDocument.content,
      };

      jest.spyOn(mockRoomModel, 'findOne').mockResolvedValue(null); 

      await expect(service.createChat(mockChat.sender.toString(), createChatDto))
              .rejects.toThrowError('Room not found');
    });
  });

  describe('getChats', () => {
    it('should return chats with pagination', async () => {
      const getChatDto: GetChatDto = {
        roomId: mockRoom._id.toString(),
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
      expect(chatModel.find).toHaveBeenCalledWith({ roomId: getChatDto.roomId });
      expect(chatModel.countDocuments).toHaveBeenCalledWith({ roomId: getChatDto.roomId });
    });

    it('should return not found for invalid RoomId', async () => {
      
      const InvalidGetChatDto: GetChatDto = {
        roomId: 'invalid-roomId',//invalid roomId
        page: 1,
        limit: 10,
      };

      jest.spyOn(mockRoomModel, 'findOne').mockResolvedValue(null); 
      
      await expect(service.getChats(InvalidGetChatDto))
            .rejects.toThrowError('Room not found');
      
    });

  });
});
