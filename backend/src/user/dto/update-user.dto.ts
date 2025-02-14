import { IsString,IsDate, IsOptional, IsArray, IsNumber } from "class-validator";
import { Type } from 'class-transformer';
import { IsAdult } from "../../validator/isAdult.validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;
    
    @IsString()
    @IsOptional()
    birthPlace: string;

    @Type(() => Date)
    @IsDate({ message: 'Invalid Date Format' })
    @IsAdult({ message: 'User must be at least 17 years old' })
    @IsOptional()
    birthDate: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsOptional()
    height: number;

    @IsOptional()
    weight:number;

    @IsString()
    @IsOptional()
    horoscope: string;

    @IsString()
    @IsOptional()
    zodiac: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true }) // Ensure every element in the array is a string
    interests: string[]

  }
  
