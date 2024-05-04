import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Otp {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  otpCode: string;

  @Prop({ required: true, type: Date, expires: '1d' })
  expirationTime: Date;

  @Prop({ required: true })
  secret: string;

  @Prop({ default: false })
  isVerified: boolean = false;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
