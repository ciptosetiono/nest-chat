import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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



const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    hash: 'hashedPassword',
    name: 'Test User',
    horoscope: 'Aries',
    birthDate: '2021-01-01',
    zodiac: '',
    interests: [],
};

const mockRoom: Room = {
    _id:  new Types.ObjectId(),
    name: 'Test Room',
    type: RoomType.PERSONAL,
    members:[mockUser._id]
}

let mockChat: Chat = {
    _id: new Types.ObjectId(),
    content: 'file.png',
    sender:  mockUser._id,
    roomId: mockRoom._id,
    files:[]
}


const fileName = 'test.png';
const path =  './uploads/'+fileName;
const file = { originalname: fileName } as Multer.File;

const mockFile: File = {
    _id: new Types.ObjectId(),
    filename: fileName,
    path: path,
    mimetype: 'png',
    chat: mockChat
}

mockChat.files.push(mockFile._id);

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

        const result = await controller.uploadFile(mockRoom._id.toString(), mockUser, file, uploadFileDto);

        expect(result).toEqual(mockChat);
        expect(fileService.uploadFile).toHaveBeenCalledWith(mockUser._id.toString(), mockRoom._id.toString(), file);
    });

    it('should return notfound for invalid roomId', async () => {

      const invalidRoomId = 'invalid-room-id';
      const uploadFileDto: UploadFileDto = {file};

      jest.spyOn(fileService, 'uploadFile').mockRejectedValue(new NotFoundException('Room not found'));

      await expect(controller.uploadFile(invalidRoomId, mockUser, file, uploadFileDto)).rejects.toThrow(NotFoundException);

    });

    it('should return BadRewuextException for invalid file', async() => {
        const uploadFileDto: UploadFileDto = {
          ...file,
          mimetype: 'txt' //invalid mimetype
        };
        jest.spyOn(fileService, 'uploadFile').mockRejectedValue(new BadRequestException('Bad request'));

        await expect(controller.uploadFile(mockRoom._id.toString(), mockUser, file, uploadFileDto)).rejects.toThrow(BadRequestException);


    });
    
  });

  describe('downloadFile', () => {
    it('should return file path if file exists', async () => {

      const res = { sendFile: jest.fn() } as unknown as Response;

      await controller.downloadFile(mockFile._id.toString(), res);

      expect(fileService.downloadFile).toHaveBeenCalledWith(mockFile._id.toString());
      expect(res.sendFile).toHaveBeenCalledWith(path);
    });

    it('should throw NotFoundException if file does not exist', async () => {
      jest.spyOn(fileService, 'downloadFile').mockResolvedValue(Promise.resolve(null as any));

      await expect(controller.downloadFile('invalidFileId', {} as Response)).rejects.toThrow(NotFoundException);
    });
  });
});
