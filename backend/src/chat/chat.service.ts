import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat } from './chat.schema';
import { DefaultPagination } from '../common/const/default-pagination';


@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>
    ) {}
 
    //create chat message
    async createChat(senderId, dto: CreateChatDto): Promise<Chat>{

      const newChat = await this.chatModel.create({...dto, sender: senderId});

      return newChat.populate('sender', 'username');

    }

    async getChats(getChatDto: GetChatDto): Promise<{messages: Chat[], totalMessages: number}>{
  
      //get roomId, page and limit from request. if page and limit not provided, use default values
      const {
        roomId,
        page = DefaultPagination.page,
        limit = DefaultPagination.limit
      } = getChatDto;

      //get chats by roomId with pagination
      const chats = await this.chatModel
                            .find({room: roomId})
                            .sort({ createdAt: -1 })
                            .populate('sender', 'username')
                            .skip((page - 1) * limit)
                            .limit(limit)
                            .exec();

      //count total chats by roomId without pagination
      const totalChats = await this.chatModel.countDocuments({room: roomId});

      //return messages and total messages
      return {
        messages: chats,
        totalMessages: totalChats
      }
                          
    }
}
