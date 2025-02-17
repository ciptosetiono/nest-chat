import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { JwtGuard } from '../auth/guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from '../user/user.schema';
import { Types } from 'mongoose';
import { RoomType } from './room.schema';


describe('RoomController', () => {
  let controller: RoomController;
  let roomService: RoomService;

  const mockRoomService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getByMember: jest.fn(),
  };

  const mockUser: User = {
    _id: new Types.ObjectId('60d0fe4f5311236168a109ca'),
    username: 'testuser',
    email: 'test@example.com',
    hash: 'hashedPassword',
    name: 'Test User',
    horoscope: 'Aries',
    birthDate: '2021-01-01',
    zodiac: '',
    interests: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [
        {
          provide: RoomService,
          useValue: mockRoomService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RoomController>(RoomController);
    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Test Room',
        type: RoomType.PERSONAL,
        members: ['testuser1', 'testuser2'],
      };

      const req = {
        user: mockUser,
      };

      const result = {
        _id: new Types.ObjectId('60d0fe4f5311236168a109cb'),
        name: 'Test Room',
        type: RoomType.PERSONAL,
        members: [mockUser, { ...mockUser, _id: new Types.ObjectId('60d0fe4f5311236168a109cb'), }],
      };

      jest.spyOn(roomService, 'create').mockResolvedValue(result);

      expect(await controller.create(req, createRoomDto)).toEqual(result);
      expect(roomService.create).toHaveBeenCalledWith(mockUser._id.toString(), createRoomDto);
    });
  });

  describe('getAll', () => {
    it('should return all rooms', async () => {
    const result = [
      {
        _id: new Types.ObjectId('60d0fe4f5311236168a109cb'),
        name: 'Test Room',
        type: RoomType.PERSONAL,
        members: [mockUser],
      },
    ];

      jest.spyOn(roomService, 'getAll').mockResolvedValue(result);

      expect(await controller.getAll()).toEqual(result);
      expect(roomService.getAll).toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('should return rooms that the user is a member of', async () => {
    const result = [
      {
        _id: new Types.ObjectId('60d0fe4f5311236168a109cb'),
        name: 'Test Room',
        type: RoomType.PERSONAL,
        members: [mockUser],
      },
    ];

      jest.spyOn(roomService, 'getByMember').mockResolvedValue(result);

      expect(await controller.getMe(mockUser)).toEqual(result);
      expect(roomService.getByMember).toHaveBeenCalledWith(mockUser._id.toString());
    });
  });
});