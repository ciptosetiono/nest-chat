import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File, FileSchema } from './file.schema';
import { Room, RoomSchema } from '../room/room.schema';
import { Chat, ChatSchema } from '../chat/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{name: Room.name, schema: RoomSchema}]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),

  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [MongooseModule],
})
export class FileModule {}