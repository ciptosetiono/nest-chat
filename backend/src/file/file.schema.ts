import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chat } from '../chat/chat.schema';
import mongoose from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true})
    filename: string;

    @Prop({ required: true})
    path: string;

    @Prop({ required: true})
    mimetype: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', autopopulate: true })
    chat: Chat;
}

export const FileSchema = SchemaFactory.createForClass(File);