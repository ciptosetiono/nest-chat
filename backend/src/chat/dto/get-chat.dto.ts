import { IsOptional, IsInt, Min } from 'class-validator';

export class GetChatDto {
  roomId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}