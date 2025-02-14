import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat, ChatDocument } from './chat.schema';
import { NotFoundException } from '@nestjs/common';
import { DefaultPagination } from 'src/common/const/default-pagination';


@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>
    ) {}
 
    //create chat message
    async createChat(senderId, dto: CreateChatDto): Promise<Chat>{

      const newChat = new this.chatModel({...dto, sender: senderId});

      const savedChat = await newChat.save();

      return savedChat.populate('sender', 'username');

    }

    async getChats(getChatDto: GetChatDto) {
  
      const { roomId, page = DefaultPagination.page, limit = DefaultPagination.limit} = getChatDto;
    

      const skip = (page - 1) * limit;
      console.log('page'+page);
      console.log('limit'+limit);
      console.log('skip'+skip);
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

      return {
        messages: chats,
        totalMessages: totalChats
      }
                          
    }




}
