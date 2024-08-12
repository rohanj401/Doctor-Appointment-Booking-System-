// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class Doctor extends Document {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ required: true })
//   speciality: string;

//   @Prop({ required: true })
//   qualification: string;

//   @Prop({ required: true,unique: true })
//   mobileNo: string;

//   @Prop({ required: true })
//   registration_no: string;

//   @Prop({ required: true })
//   year_of_registration: string;

//   @Prop({ required: true })
//   state_medical_council: string;

//   @Prop()
//   address: string;

//   @Prop()
//   bio: string;

//   @Prop()
//   documentUrl: string;

//   @Prop({ default: false })
//   is_verified: boolean;

//   @Prop()
//   profilePic: string;
// }

// export const DoctorSchema = SchemaFactory.createForClass(Doctor);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClinicDetails } from 'src/doctors/dtos/clinicDetails';
import { Coordinates } from 'src/doctors/dtos/coordinates';

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

  // @Prop()
  // clinicName: string;

  // @Prop()
  // city: string;

  // @Prop()
  // state: string;

  @Prop()
  bio: string;

  @Prop()
  document: string;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop()
  profilePic: string;

  // @Prop()
  // pinCode: number;

  @Prop()
  clinicDetails:ClinicDetails;
  // @Prop()
  // coordinates?: Coordinates;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
