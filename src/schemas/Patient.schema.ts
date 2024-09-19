import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Address } from '../patients/dtos/adddress';

@Schema({ timestamps: true })
export class Patient {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  contactNumber: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  address: Address;

  @Prop()
  bloodGroup: string;

  @Prop({ require: true })
  gender: string;

  @Prop({ require: true })
  profilePic: string;

  // @Prop({ required: true })
  // age: number;

  // @Prop({ required: true })
  // profilePic: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
