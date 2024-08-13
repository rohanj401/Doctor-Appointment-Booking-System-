import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reports extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
 doctor_id: string;
  
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
 patient_id: string;

  @Prop({
    required: true,
  })
 report: string;

  @Prop({ required: true })
  comment: string;
}

export const ReportsSchema = SchemaFactory.createForClass(Reports);
