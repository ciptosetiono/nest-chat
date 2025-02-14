import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from 'src/chat/chat.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    ChatService,
    AuthService,
    ChatGateway,
    JwtService
  ],
  controllers: [],
  exports: [
    ChatService,
  ],
})
export class ChatModule {}
