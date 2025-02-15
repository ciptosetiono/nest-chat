import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { ForbiddenException, BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { GetUser } from '../decorator/get-user.decorator';

// Mock UserService
const mockUserService = {
  updateUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: typeof mockUserService;
  let validationPipe: ValidationPipe;

  const mockUser: User = {
    _id: new Types.ObjectId('60d0fe4f5311236168a109ca'),
    username: 'testuser',
    email: 'test@example.com',
    hash: 'hashedPassword',
    name: 'Test User',
    hosroscope: 'Aries',
    birthDate: '2021-01-01',
    zodiac: '',
    interests: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
    .overrideGuard(JwtGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<typeof mockUserService>(UserService);
    validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    jest.clearAllMocks();
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the user object if user is present', () => {
      const result = controller.getMe(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if no user is present', () => {
        const getUser = jest.fn().mockReturnValue(null);
        expect(() => controller.getMe(getUser())).toThrow(ForbiddenException);
    });
  });

  describe('updateUser', () => {
    it('should call userService.updateUser with correct parameters', async () => {
      const updateDto: UpdateUserDto = {
          name: 'name test',
          birthPlace: '',
          birthDate: '',
          height: 0,
          weight: 0,
          horoscope: '',
          zodiac: '',
          interests: []
      };
      const updatedUser = { ...mockUser};

      userService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser, updateDto);
      expect(result).toEqual(updatedUser);
      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUser._id.toString(),
        updateDto,
      );
    });

    it('should throw BadRequestException when updateUserDto is invalid', async () => {
      const invalidDto: Partial<UpdateUserDto> = {
        birthDate: 'invalidDate',
      };
        await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: UpdateUserDto}))
                      .rejects.toThrow(BadRequestException);
        expect(userService.updateUser).not.toHaveBeenCalled();
    });
  });
});
