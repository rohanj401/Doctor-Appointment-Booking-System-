import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClinicDetails } from 'src/doctors/dtos/clinicDetails';
import { Availability, AvailabilitySchema } from './Availability.schema';

@Schema()
export class Doctor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  speciality: string;

  @Prop({ required: true })
  qualification: string;

  @Prop({ required: true, unique: true })
  contactNumber: string;

  @Prop({ required: true })
  registrationNumber: string;

  @Prop({ required: true })
  yearOfRegistration: string;

  @Prop({ required: true })
  stateMedicalCouncil: string;

  @Prop()
  name: string;

  @Prop()
  bio: string;

  @Prop()
  document: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: true })
  gender: string;

  @Prop()
  profilePic: string;

  @Prop({ type: ClinicDetails, required: true })
  clinicDetails: ClinicDetails;

  @Prop({
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @Prop({ type: [AvailabilitySchema], required: true })
  availability: Availability[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
DoctorSchema.index({ location: '2dsphere' });
