import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "src/user/user.schema";

export class UserService {
     constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
      ) {}
    
    //update user by id and dto
    async updateUser(userId: string, dto: UpdateUserDto): Promise <User> {
     
        //convert birthDate to ISO string
        const birthDate = new Date(dto.birthDate).toISOString().split("T")[0];

       //inject birthDate to dto
        const updateDto = {...dto, birthDate: birthDate};

        //find and update user
        let user = await this.userModel.findByIdAndUpdate(userId, updateDto, { new: true, runValidators: true }).lean();
        if (user) {
            delete (user as Record<string, unknown>).hash;
            return user;
        }
        //throw error if user failed to update
        throw new BadRequestException('Failed to update user');
    }

    async findByUsernames(usernames: string[]): Promise<User[]> {
        return this.userModel
                        .find({username: {$in: usernames}})
                        .lean();
    }
}