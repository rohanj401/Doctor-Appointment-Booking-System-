import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Slot extends Document {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: ['available', 'booked', 'cancelled'] })
  status: 'available' | 'booked' | 'cancelled';
}
export const SlotSchema = SchemaFactory.createForClass(Slot);
