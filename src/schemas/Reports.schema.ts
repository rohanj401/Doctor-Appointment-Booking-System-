import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reports extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Types.ObjectId;

  @Prop({ required: true })
  reportName: string;

  @Prop({ required: true })
  uploadReport: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor' })
  doctor: Types.ObjectId;

  @Prop()
  appointmentDate: Date;

  @Prop({ required: false })
  date: Date;
}

export const ReportsSchema = SchemaFactory.createForClass(Reports);
