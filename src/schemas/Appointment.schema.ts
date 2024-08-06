import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from './doctor.schema';
import { Patient } from './patient.schema';

@Schema()
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Types.ObjectId;

  @Prop({ required: true })
  appointment_date: Date;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
