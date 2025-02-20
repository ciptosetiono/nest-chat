import { RoomType } from '../room.schema';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class CreateRoomDto {
    @IsNotEmpty()
    @MinLength(3)
   // @ValidateIf(o => o.type != RoomType.PERSONAL)
    name: string;

    @IsArray()
    @IsOptional()
    members: string[];

    @IsEnum(RoomType)
    @ValidateIf(o => o.type)
    type: RoomType;
}