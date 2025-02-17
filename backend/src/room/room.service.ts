import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class RoomService {

    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
        private userService: UserService
    ) { }

    //create new room from user and dto
    async create(userId: string, dto: CreateRoomDto): Promise<Room> {

        //find users by username of members
        const members = await this.userService.findByUsernames(dto.members);

        //get user ids
        const memberIds = await members.map(user => user._id.toString());

        //inject memberIds to dto
        dto = {...dto, members: memberIds};

        //push the room creator to members
        dto.members.push(userId);

        //save the room
        const createdRoom = new this.roomModel(dto);

        //return the room
        return await createdRoom.save();
    }

    //return all rooms
    async getAll(): Promise<Room[]> {
        return await this.roomModel.find().exec();
    }

    //return rooms that user in members
    async getByMember(userId: string): Promise<Room[]> {
        return await this.roomModel.find({ members: userId }).exec();
    }

    async getById(id: string): Promise<Room> {
        const room = await this.roomModel.findById(id).exec();
        if (room) {
           return room;
        }
        throw new NotFoundException(`Room with id ${id} not found`);
    }

    
}
