import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto, SearchRoomDto } from './dto';
import { UserService } from '../user/user.service';
import { DefaultPagination } from '../common/const/default-pagination';
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

        //get member ids
        const memberIds = await members.map(user => user._id);

        //inject memberIds to dto
        const createRoomDto = {...dto, members: memberIds,  _id: new Types.ObjectId()};

        //push the room sender userIdto members
        createRoomDto.members.push(new Types.ObjectId(userId));

        //save the room
        const createdRoom = new this.roomModel(createRoomDto);

        //return the room
        return await createdRoom.save();
    }

    //return all rooms
    async getAll(): Promise<Room[]> {
        return await this.roomModel.find().exec();
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

    async addUserToRoom(roomId: string, userId: string) {

        const room = await this.getById(roomId);

        //check the userId is valid
        const user = await this.userService.findById(userId);
        if(!user){
            throw new BadRequestException('User not Found');
        }

        try {
            if (!room.members.some(member => member.equals(user._id))) {
                room.members.push(user._id);
                await room.save();
            }
            return room;
        } catch (error) {
            console.log("Failed Add user to room ..."+error);
            throw new InternalServerErrorException(error.message);
        }
        
    }

    //return rooms that user in members
    async getByMember(userId: string): Promise<Room[]> {
        return await this.roomModel.find({ members: userId }).exec();
    }

    async getById(id: string){

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Room not found`);
        }

        const room = await this.roomModel.findById(new Types.ObjectId(id));

        if (!room) {
            throw new NotFoundException(`Room with id ${id} not found`);
        }
        return room;
      
    }

}
