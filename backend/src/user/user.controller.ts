import { Controller, Get, Put, Body, BadRequestException, ForbiddenException, Param, NotFoundException } from '@nestjs/common';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from './user.schema';
import { JwtGuard } from '../auth/guard';
import { UseGuards } from '@nestjs/common';
import { UpdateUserDto, SearchUserDto  } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    //handle get user by auhtenticated user. the user get from GetUser decorator
    @Get('me')
    getMe(@GetUser() user: User): User{

        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Put('update')
    async updateUser(
        @GetUser() user: User,
        @Body() updateDto: UpdateUserDto
    ): Promise<User>{        
         return await this.userService.updateUser(user._id.toString(), updateDto);
    }

    @Get('/search')
    async searchUser(
        @Body() searchUserDto: SearchUserDto
    ): Promise<{users: User[], total:number}> {

        return await this.userService.searchUsers(searchUserDto);
    }
    
}
