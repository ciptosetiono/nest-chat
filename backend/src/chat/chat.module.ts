import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from '../chat/chat.schema';
import { User, UserSchema } from '../user/user.schema';
import { File, FileSchema } from '../file/file.schema';
import { Room, RoomSchema } from '../room/room.schema';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';
import { FileService } from '../file/file.service';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [
    AuthService,
    ChatService,
    ChatGateway,
    FileService,
    JwtService,
  ],
  controllers: [],
  exports: [
    ChatService,
  ],
})
export class ChatModule {}
