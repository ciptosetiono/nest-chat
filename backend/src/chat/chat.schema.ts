import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Chat {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop()
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    sender: Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    roomId: Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }] })
    files: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
