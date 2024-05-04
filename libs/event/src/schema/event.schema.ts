import { Prop, SchemaFactory, Schema, raw } from '@nestjs/mongoose';
import { Slot, SlotSchema } from '@app/event/schema/slot.schema';

@Schema({ versionKey: false, timestamps: true })
export class Event {
  @Prop({})
  title: string;

  @Prop()
  description: string;

  @Prop()
  avatar: string;

  @Prop([String])
  categories: string[];

  @Prop([String])
  types: string[];

  @Prop(raw([SlotSchema]))
  slots: Slot[];

  @Prop(
    raw({
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    }),
  )
  location: Record<string, string | number>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
