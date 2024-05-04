import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Partner & Document;

@Schema({ timestamps: true, virtuals: true, versionKey: false })
export class Partner {
  @Prop({ required: true })
  fullName?: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: true, unique: true })
  phone?: string;

  @Prop({ default: false })
  isApproved?: boolean;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
