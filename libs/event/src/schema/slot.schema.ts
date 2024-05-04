import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Slot {
  @Prop({ type: Date })
  startDate: Date;

  @Prop()
  gateway: string;

  @Prop()
  section: string;

  @Prop()
  seat: string;

  @Prop()
  price: number;

  ticketId?: string;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
