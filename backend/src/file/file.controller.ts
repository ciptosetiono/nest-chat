import { Controller, Post, Get, Body, Param, UploadedFile, UseGuards, UseInterceptors, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage  } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { UploadFileDto } from './dto';
import { GetUser } from '../decorator/get-user.decorator';
import { FileService } from './file.service';
import { User } from '../user/user.schema';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('files')
export class FileController {
    constructor ( private fileService: FileService) {}

    @Post('upload/:roomId')
    @UseInterceptors(
     FileInterceptor('file', {
       storage: diskStorage({
         destination: './uploads',
         filename: (req, file, cb) => {
           const filename = `${uuidv4()}-${file.originalname}`;//create unique filename
           cb(null, filename);
         },
       }),
     }),
   )
   async uploadFile(
        @Param('roomId') roomId: string,
        @GetUser() user: User,
        @UploadedFile() file: Multer.File, @Body() uploadFileDto: UploadFileDto,
   ) {
       
        return this.fileService.uploadFile(user._id.toString(), roomId, file);
   }



   @Get('download/:fileId')
   async downloadFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
   ){

      const file = await this.fileService.downloadFile(fileId);
      if (!file) {
          throw new NotFoundException('File not found');
      }
      res.sendFile(this.fileService.getFilePath(file));

   }
}
