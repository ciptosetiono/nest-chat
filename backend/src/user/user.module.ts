import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from '../user/user.schema';
import { HoroscopeService } from '../horoscope/horoscope.service';

@Module({
  imports:[
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HoroscopeService
  ]
})
export class UserModule {}
