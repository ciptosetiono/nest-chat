import { Controller, Get, Put, Body, BadRequestException, ForbiddenException } from '@nestjs/common';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from './user.schema';
import { JwtGuard } from '../auth/guard';
import { UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe(@GetUser() user: User): User{
        if(!user){
            throw new ForbiddenException('Invalid token');
        }
        return user;
    }

    @Put('update')
    async updateUser(
        @GetUser() user: User,
        @Body() dto: UpdateUserDto
    ): Promise<User>{        
         return await this.userService.updateUser(user._id.toString(), dto);
    }
}
