import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat } from './chat.schema';
import { DefaultPagination } from '../common/const/default-pagination';
import { File } from '../file/file.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(File.name) private fileModel: Model<File>, 
  ) {}

  /**
   * Create a new chat message.
   * @param senderId - UserID of the sender.
   * @param dto - Data transfer object containing chat details.
   * @returns The created chat message.
   */
  async createChat(senderId: string, dto: CreateChatDto): Promise<Chat> {
    const newChat = await this.chatModel.create({
      ...dto,
      sender: senderId,
      _id: new Types.ObjectId()
    });

    return newChat.populate('sender', 'username');
  }

  /**
   * Get chat messages with pagination.
   * @param getChatDto - Data transfer object containing pagination and room details.
   * @returns An object containing the chat messages and total number of messages.
   */
  async getChats(getChatDto: GetChatDto): Promise<{ messages: Chat[], totalMessages: number }> {
    const {
      roomId,
      page = DefaultPagination.page,
      limit = DefaultPagination.limit
    } = getChatDto;

    // Get chats by roomId with pagination
    const chats = await this.chatModel
      .find({ roomId: roomId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username')
      .populate('files')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Count total chats by roomId without pagination
    const totalChats = await this.chatModel.countDocuments({ room: roomId });

    // Return messages and total messages
    return {
      messages: chats,
      totalMessages: totalChats
    };
  }
}
