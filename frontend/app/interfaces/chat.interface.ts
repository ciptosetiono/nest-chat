import { Sender } from "./sender.interface";

export interface Chat{
    _id: string;
    roomId: string;
    sender: Sender;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
  