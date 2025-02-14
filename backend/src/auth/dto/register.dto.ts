import { IsEmail, IsString,IsNotEmpty } from "class-validator";
    
  export class RegisterDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

  }
  
