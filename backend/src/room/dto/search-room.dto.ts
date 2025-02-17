import { IsString, IsNotEmpty, IsInt, Min, IsOptional} from 'class-validator';

export class SearchRoomDto {

    @IsString()
    @IsNotEmpty()
    query: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;
}