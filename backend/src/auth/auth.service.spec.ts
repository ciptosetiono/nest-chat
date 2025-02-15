import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from 'src/user/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUser: UserInterface = {
    _id: '12345',
    username: 'testuser',
    email: 'test@gmail.com',
    hash: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw BadRequestException if username already exists', async () => {
      jest.spyOn(authService, 'findUserByUsername').mockResolvedValue(mockUser);

      const dto: RegisterDto = {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'password123',
      };

      await expect(authService.signup(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email already exists', async () => {
      jest.spyOn(authService, 'findUserByUsername').mockResolvedValue(null);
      jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(mockUser);

      const dto: RegisterDto = {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'password123',
      };

      await expect(authService.signup(dto)).rejects.toThrow(BadRequestException);
    });

    it('should return user and access token on successful signup', async () => {
      jest.spyOn(authService, 'findUserByUsername').mockResolvedValue(null);
      jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(argon, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(mockUserModel, 'save').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'signToken').mockResolvedValue('valid_token');

      const dto: RegisterDto = {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'password123',
      };

      const result = await authService.signup(dto);

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'valid_token',
      });
    });
  });

  describe('signin', () => {
    it('should throw ForbiddenException if user not found', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const dto: LoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      await expect(authService.signin(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should return user and access token on successful signin', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'signToken').mockResolvedValue('valid_token');

      const dto: LoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      const result = await authService.signin(dto);

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'valid_token',
      });
    });
  });

  describe('validateUser', () => {
    it('should throw ForbiddenException if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(authService.validateUser('test@gmail.com', 'password123')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password does not match', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(argon, 'verify').mockResolvedValue(false);

      await expect(authService.validateUser('test@gmail.com', 'password123')).rejects.toThrow(ForbiddenException);
    });

    it('should return user if password matches', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);

      const result = await authService.validateUser('test@gmail.com', 'password123');

      expect(result).toEqual(mockUser);
    });
  });

  describe('signToken', () => {
    it('should return a valid JWT token', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'secret';
        if (key === 'JWT_EXP_TIME') return '1h';
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('valid_token');

      const result = await authService.signToken('12345', 'test@gmail.com');

      expect(result).toEqual('valid_token');
    });
  });
});