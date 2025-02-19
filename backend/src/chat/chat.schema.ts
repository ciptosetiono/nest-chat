import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Room } from "../room/room.schema";
import { User } from "../user/user.schema";
import { File } from "../file/file.schema";

//export type ChatDocument = HydratedDocument<Chat>;
export type ChatDocument = Chat & Document;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Chat {

    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({})
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: true })
    sender: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    room: Room;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], autopopulate: true })
    files: File[];
    

}

export const ChatSchema = SchemaFactory.createForClass(Chat);