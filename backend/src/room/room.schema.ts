import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";


export enum RoomType {
    PERSONAL = 'personal',
    GROUP = 'group',
}

export type RoomDocument = Room & Document;

@Schema(
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)
export class Room {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;
    
    @Prop()
    name: string;

    @Prop({ enum: RoomType, default: RoomType.PERSONAL })
    type: RoomType;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    members: mongoose.Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);


