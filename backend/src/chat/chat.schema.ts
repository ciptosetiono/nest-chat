import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Room } from "../room/room.schema";
import { User } from "../user/user.schema";

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Chat {

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: true })
    sender: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    room: Room;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);