import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto, SearchRoomDto } from './dto';
import { UserService } from '../user/user.service';
import { DefaultPagination } from 'src/common/const/default-pagination';
import { Types } from 'mongoose';
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

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid room ID: ${id}`);
        }

        const room = await this.roomModel.findById(id).exec();

        if (room) {
           return room;
        }
        throw new NotFoundException(`Room with id ${id} not found`);
    }

    async search(dto: SearchRoomDto): Promise<{rooms:Room[], total:number}> {

        //get query, page and limit from dto
        const {query, page = DefaultPagination.page, limit = DefaultPagination.limit} = dto;

        //calculate skip
        const skip = (page - 1) * limit;
        
        //search room by name with pagination
        const rooms = await this.roomModel.find({name: {$regex: query, $options: 'i'}})
                                            .skip(skip)
                                            .limit(limit)
                                            .lean();
        //count total rooms
        const total = await this.roomModel.countDocuments({name: {$regex: query, $options: 'i'}});
    
        //return rooms and total rooms
        return {rooms, total};
    }
    
}
