import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User{
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;
  
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop()
  name: string;

  @Prop({
    required: true,
  })
  hash: string;

  @Prop()
  birthPlace?: string;

  @Prop()
  birthDate?: string;

  @Prop()
  gender?:string;

  @Prop()
  height?:number;

  @Prop()
  weight?:number;

  @Prop()
  horoscope:string;

  @Prop()
  zodiac:string;

  @Prop({ type: [String], default: [] })
  interests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);