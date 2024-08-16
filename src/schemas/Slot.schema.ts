import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Slot extends Document {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: ['available', 'booked'] })
  status: 'available' | 'booked';
}
export const SlotSchema = SchemaFactory.createForClass(Slot);
