import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { NotFoundException } from '@nestjs/common';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '../user/user.schema';
import { Response } from 'express';
import { UploadFileDto } from './dto';
import { File } from './file.schema';
import { Chat } from '../chat/chat.schema';
import { Multer } from 'multer';
import { Types } from 'mongoose';
import { Room, RoomType } from '../room/room.schema';

jest.mock('../decorator/get-user.decorator', () => ({
  GetUser: jest.fn(() => jest.fn()),
}));



const mockUserId = '67b2b296b6f4c6b415fb2f1c';
const mockUser: User = {
    _id: new Types.ObjectId(mockUserId),
    username: 'testuser',
    email: 'test@example.com',
    hash: 'hashedPassword',
    name: 'Test User',
    horoscope: 'Aries',
    birthDate: '2021-01-01',
    zodiac: '',
    interests: [],
};

const mockRoomId = '60d0fe4f5311236168a109cc';
const mockRoom: Room = {
    _id:  new Types.ObjectId(mockRoomId),
    name: 'Test Room',
    type: RoomType.PERSONAL,
    members:[mockUser]
}

const mockChatId = '60d0fe4f5311236168a109cc';
let mockChat: Chat = {
    _id: new Types.ObjectId(mockChatId ),
    content: 'file.png',
    sender:  mockUser,
    room: mockRoom,
    files:[]
}

const mockFileId = '60d0fe4f5311236168a109cc';
const fileName = 'test.png';
const path =  './uploads/'+fileName;
const file = { originalname: fileName } as Multer.File;

const mockFile: File = {
    _id: new Types.ObjectId(mockFileId ),
    filename: fileName,
    path: path,
    mimetype: 'png',
    chat: mockChat
}

mockChat.files.push(mockFile);

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;

  const mockFileService = {
    uploadFile: jest.fn().mockResolvedValue(mockChat),
    downloadFile: jest.fn().mockResolvedValue({ path: path }),
    getFilePath: jest.fn().mockReturnValue(path),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        { provide: FileService, useValue: mockFileService },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return model chat model', async () => {

        const uploadFileDto: UploadFileDto = {file};

        const result = await controller.uploadFile(mockRoomId, mockUser, file, uploadFileDto);

        expect(result).toEqual(mockChat);
        expect(fileService.uploadFile).toHaveBeenCalledWith(mockUserId, mockRoomId, file);
    });
  });

  describe('downloadFile', () => {
    it('should return file path if file exists', async () => {

      const res = { sendFile: jest.fn() } as unknown as Response;

      await controller.downloadFile(mockFileId, res);

      expect(fileService.downloadFile).toHaveBeenCalledWith(mockFileId);
      expect(res.sendFile).toHaveBeenCalledWith(path);
    });

    it('should throw NotFoundException if file does not exist', async () => {
      jest.spyOn(fileService, 'downloadFile').mockResolvedValue(Promise.resolve(null as any));

      await expect(controller.downloadFile('invalidFileId', {} as Response)).rejects.toThrow(NotFoundException);
    });
  });
});
