import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from "src/user/user.schema";
import { NotFoundException } from "@nestjs/common";
import { User } from "src/user/user.schema";

export class UserService {
     constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
      ) {}
    
    async updateUser(userId: string, dto: UpdateUserDto): Promise <User> {
     
        const birthDate = new Date(dto.birthDate).toISOString().split("T")[0]; // "
       
        dto = {...dto, birthDate: birthDate};
        let user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true, runValidators: true }).lean();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user) {
            delete (user as Record<string, unknown>).hash;
            return user;
        }

        throw new NotFoundException('User not found');
    }

    async findByUsernames(usernames: string[]): Promise<User[]> {
        let users = this.userModel
                        .find({username: {$in: usernames}})
                        .lean();

        return users;
    }
}