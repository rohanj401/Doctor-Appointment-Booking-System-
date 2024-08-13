import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Medicine {
  @Prop({ required: true })
  medicineName: string;

  @Prop({
    type: [String],
    enum: ['Morning', 'Afternoon', 'Night'],
    required: true,
  })
  dosage: string[];

  @Prop({
    type: String,
    enum: ['Before Meal', 'After Meal'],
    required: true,
  })
  time: string;
}

@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({ type: [Medicine], required: true })
  medicine: Medicine[];

  @Prop({ type: String })
  updateReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'doctors', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'patients', required: true })
  patient: Types.ObjectId;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
