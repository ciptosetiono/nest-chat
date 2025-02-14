import { RoomType } from 'src/room/room.schema';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class CreateRoomDto {
    @IsNotEmpty()
    @ValidateIf(o => o.type != RoomType.PERSONAL)
    name: string;

    @IsArray()
    @IsOptional()
    members: string[];

    @IsEnum(RoomType)
    @ValidateIf(o => o.type)
    type: RoomType;
}