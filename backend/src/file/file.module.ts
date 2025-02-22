import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File, FileSchema } from './file.schema';
import { Room, RoomSchema } from '../room/room.schema';
import { Chat, ChatSchema } from '../chat/chat.schema';
import { ChatService } from '../chat/chat.service';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{name: Room.name, schema: RoomSchema}]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    FileService,
    ChatService,
    RoomService,
    UserService,
  ],
  controllers: [FileController],
  exports: [MongooseModule],
})
export class FileModule {}