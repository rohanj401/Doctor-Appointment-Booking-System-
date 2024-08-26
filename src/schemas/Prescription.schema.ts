// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// @Schema()
// export class Medicine {
//   @Prop({ required: true })
//   name: string;

//   @Prop({
//     type: [String],
//     enum: ['Morning', 'Afternoon', 'Night'],
//     required: true,
//   })
//   dosage: string[];

//   @Prop({
//     type: String,
//     enum: ['Before Meal', 'After Meal'],
//     required: true,
//   })
//   time: string;

//   @Prop({ type: Number }) // Use Number instead of number
//   days: number;
// }

// @Schema({ timestamps: true })
// export class Prescription extends Document {
//   @Prop({ type: [Medicine], required: true })
//   medicine: Medicine[];

//   @Prop({ type: String })
//   updateReason?: string;

//   @Prop({ required: true })
//   appointmentDate: Date;

//   @Prop({ required: true })
//   slotId: Types.ObjectId;

//   @Prop({ type: String })
//   doctorName?: string;

//   @Prop({ type: String })
//   patientName?: string;

//   @Prop({ type: Types.ObjectId, ref: 'doctors', required: true })
//   doctorId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'patients', required: true })
//   patientId: Types.ObjectId;
// }

// export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
// export const MedicineSchema = SchemaFactory.createForClass(Medicine);

// src/schemas/prescription.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Medicine {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [String],
    enum: ['morning', 'afternoon', 'night'],
    required: true,
  })
  dosage: string[];

  @Prop({
    type: String,
    enum: ['Before Meal', 'After Meal'],
    required: true,
  })
  time: string;

  @Prop({ type: Number })
  days: number;
}

@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({ type: [Medicine], required: true })
  medicines: Medicine[]; // Note: Changed from 'medicine' to 'medicines' to match request

  @Prop({ type: String })
  note?: string;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  slotId: Types.ObjectId;

  @Prop({ type: String })
  doctorName?: string;

  @Prop({ type: String })
  patientName?: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
