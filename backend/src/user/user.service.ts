import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "src/user/user.schema";
import { SearchUserDto } from './dto/search-user.dto';
import { DefaultPagination } from '../common/const/default-pagination';
import { HoroscopeService } from '../horoscope/horoscope.service';

import { Types } from 'mongoose';

export class UserService {
     constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
      ) {}
    
    //update user by id and dto
    async updateUser(userId: string, dto: UpdateUserDto): Promise <User> {
     
        const userObjectId = new Types.ObjectId(userId);

        //convert birthDate to ISO string
        if(dto.birthDate) {
            const birthDate = new Date(dto.birthDate);

            //convert birth date to string and remove the ttimezone
            const birthDateString = birthDate.toISOString().split("T")[0];

            const zodiacs = this.countZodiac(birthDateString );
            const {zodiac, horoscope } = zodiacs;

            console.log(horoscope);
         
            //inject to dto
           dto = {...dto, birthDate: birthDateString, zodiac, horoscope};
        }
          

        let user = await this.userModel.findByIdAndUpdate(userObjectId, dto, { new: true, runValidators: true }).lean();
 
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


    async searchUsers(dto: SearchUserDto): Promise<{users: User[], total:number}> {

        //get query, page and limit from dto
        const {query, page = DefaultPagination.page, limit = DefaultPagination.limit} = dto;

        //calculate skip
        const skip = (page - 1) * limit;
        
        //search user by username with pagination
        const users = await this.userModel.find({username: {$regex: query, $options: 'i'}})
                                          .skip(skip)
                                          .limit(limit)
                                          .lean();
        //count total user
        const total = await this.userModel.countDocuments({username: {$regex: query, $options: 'i'}});

        return {users, total};
    }
       
    countZodiac(date: string): {zodiac:string, horoscope:string}{
        const horoscopeService  =  new HoroscopeService();
        horoscopeService .setDate(date);
        return {
            'zodiac':  horoscopeService.getZodiacSign(),
            'horoscope': horoscopeService .getChineseZodiacSign()
        }
    }
}