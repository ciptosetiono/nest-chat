import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserInterface } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async register(
        @Body() dto: RegisterDto
    ): Promise<{user: UserInterface, accessToken: string}>{
        return  await this.authService.signup(dto);
    }

    @Post('login')
    async signin(
        @Body() dto: LoginDto
    ): Promise<{user: UserInterface, accessToken: string}> {
        return  await this.authService.signin(dto);
    }
}
