import { IsOptional, IsString, IsInt, Min, IsNotEmpty } from "class-validator";

export class SearchUserDto {
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