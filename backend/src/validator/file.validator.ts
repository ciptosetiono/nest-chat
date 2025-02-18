import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Multer } from 'multer';

export function IsFileValid(allowedTypes: string[], maxSize: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFileValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }

          const file: Multer.File = value;
          
          // Check file type
          if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(`Invalid file type! Allowed types: ${allowedTypes.join(', ')}`);
          }

          // Check file size
          if (file.size > maxSize) {
            throw new BadRequestException(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `File validation failed for property ${propertyName}`;
        },
      },
    });
  };
}
