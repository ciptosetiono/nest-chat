import { Sender } from "./sender.interface";
import { File } from "./file.interface";

export interface Chat{
    _id: string;
    roomId: string;
    sender: Sender;
    content: string;
    files: File[];
    createdAt: Date;
    updatedAt: Date;
}
  