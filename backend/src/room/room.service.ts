import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from 'src/room/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomService {

    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
        private userService: UserService
    ) { }

    //create room
    async create(userId: string, dto: CreateRoomDto): Promise<Room> {

        //find users by username of members
        const members = await this.userService.findByUsernames(dto.members);
        //get user ids
        const memberIds = await members.map(user => user._id.toString());

        //updat dto members
        dto = {...dto, members: memberIds};

        //push the room creator
        dto.members.push(userId);

        //save the room
        const createdRoom = new this.roomModel(dto);

        //return the room
        return await createdRoom.save();
    }

    async getAll(): Promise<Room[]> {
        return await this.roomModel.find().exec();
    }

    async getByMember(userId: string): Promise<Room[]> {
        return await this.roomModel.find({ members: userId }).exec();
    }


}
