import { IsDate, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class GetZodiacDto {
    @Type(() => Date)
    @IsDate({ message: 'Invalid Date Format' })
    @IsDate()
    @IsNotEmpty()
    date: string
}