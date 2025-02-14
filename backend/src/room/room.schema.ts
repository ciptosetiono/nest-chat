import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "../user/user.schema";

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

    @Prop()
    name: string;

    @Prop({ enum: RoomType, default: RoomType.PERSONAL })
    type: RoomType;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: true }])
    members: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);


