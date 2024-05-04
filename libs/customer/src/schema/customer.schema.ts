import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, virtuals: true, versionKey: false })
export class Customer {
  @Prop({ required: true })
  fullName?: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: true, unique: true })
  phone?: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
