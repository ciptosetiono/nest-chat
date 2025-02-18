import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './file.schema';
import { Model, Types} from 'mongoose';
import { Chat, ChatDocument } from 'src/chat/chat.schema';
import { Room, RoomDocument } from 'src/room/room.schema';
import { Multer } from 'multer';
import { join } from 'path';


@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private fileModel: Model<FileDocument>,
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    ){}
    async uploadFile(userId:string, roomId: string, file: Multer.File){

         //ensure the roomId is valid
        if (!Types.ObjectId.isValid(roomId)) {
            throw new NotFoundException(`Invalid Room ID: ${roomId}`);
        }

        //find chat by roomId
        const room = await this.roomModel.findById(roomId); 

        //throw if chat not found
        if(!room){
            throw new NotFoundException(`Chat Room with  Id ${roomId} Not Found`);
        }

        //create new chat
        const newChat = await this.createChat(roomId, userId);

        //create new file
        const newFile = await this.createFile(newChat._id, file);
       
        //push the new file to chat
        newChat.files.push(newFile);
        

        //save and return the file
        return newChat;

    }


    async createChat(roomId: string, userId: string): Promise<Chat>{
        const roomObjectId = new Types.ObjectId(roomId);
        const userObjectId = new Types.ObjectId(userId);
        try {
             //create new chat
            const newChat = new this.chatModel({
                _id: new Types.ObjectId(),
                room: roomObjectId,
                sender: userObjectId ,
                content:'',
            });
            return await newChat.save();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('failed to save new chat');
        }
    }

    async createFile(chatId: Types.ObjectId, file: Multer.File): Promise<File>{
        try {
            //create new file
            const newFile = new this.fileModel({
                _id: new Types.ObjectId(),
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                chat: chatId
            });
            //save and return the file
            await  newFile.save()
            
            //populate the chat with the new file
            await newFile.populate('chat');

            return newFile;

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('failed to save new file');
        }
    }

    
    async downloadFile(fileId: string): Promise<File> {
     
        //convert string fileId to object Id
        const fileObjectId = new Types.ObjectId(fileId);

        //find file by file object Id
        const file = await this.fileModel.findById(new Types.ObjectId(fileObjectId));

        //throw if file not exist
        if (!file) {
          throw new NotFoundException('File not found');
        }
        
        //return the file
        return file;
    }

   
    getFilePath(file: File): string {
        return join(__dirname, '..', '..', file.path);
    }
}
