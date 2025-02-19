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
    /**
     * handle upload file
     * 1. find room by roomId, throw notfound exception if nroom not found
     * 2. create new Chat Model
     * 3. create new File model
     * 4. Push the File Model to Chat Model
     * 5. return the chat
     * @param userId
     * @param roomId 
     * @param file 
     * @returns chat
     */
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

        //set the original name of file as chat content
        const chatContent = `${file.originalName}`;

        //create new chat
        const newChat = await this.createChat(roomId, userId, chatContent);

        //create new file
        const newFile = await this.createFile(newChat._id, file);
       
        //push the new file to chat
        newChat.files.push(newFile);
        await newChat.save();
        await newChat.populate('sender', 'username');
        //return the file
        return newChat;

    }

    /**
     * save new Chat model to database
     * @param roomId 
     * @param userId 
     * @param content 
     * @returns Chat
     */
    async createChat(roomId: string, userId: string, content: string){
        //convert roomId & userId from string to objectId
        const roomObjectId = new Types.ObjectId(roomId);
        const userObjectId = new Types.ObjectId(userId);

        try {
            const newChat = new this.chatModel({
                _id: new Types.ObjectId(),
                room: roomObjectId,
                sender: userObjectId ,
                content:content,
            });
            return await newChat.save();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('failed to save new chat');
        }
    }

    /**
     * save new File model to databases
     * @param chatId 
     * @param file 
     * @returns File
     */
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

    /**
     * find File model By fileId. 
     * if not found, throw exception
     * @param fileId 
     * @returns 
     */
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
