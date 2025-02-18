import { IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFileValid } from '../../validator/file.validator';
import { Multer } from 'multer';

export class UploadFileDto {
  @IsOptional()
  @IsFileValid(['image/jpeg', 'image/png', 'application/pdf'], 10 * 1024 * 1024, {
    message: 'Invalid file type or size.',
  })
  @Type(() => Object) // Ensures file is recognized as an object
  @IsNotEmpty() // Ensures the file is not empty
  file: Multer.File;
}