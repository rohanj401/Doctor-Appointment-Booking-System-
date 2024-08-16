// src\schemas\Availability.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Slot, SlotSchema } from './Slot.schema';

@Schema()
export class Availability extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true, type: [{ type: SlotSchema }] })
  slots: Slot[];
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
