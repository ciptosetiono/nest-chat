import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../decorator/get-user.decorator';
import { User} from '../user/user.schema';


@Controller('rooms')
@UseGuards(JwtGuard)
export class RoomController {

  constructor(
    private readonly roomService: RoomService,
  ) { }

  @Post()
  create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(req.user._id.toString(), createRoomDto);
  }
  
  //get all rooms
  @Get()
  getAll() {
    return this.roomService.getAll();
  }

  //get room that user in member
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.roomService.getByMember(user._id.toString());
  }

}