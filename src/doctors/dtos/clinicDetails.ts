// import { IsNumber, IsString } from 'class-validator';
// import { Coordinates } from './coordinates';

// export class ClinicDetails {
//     @IsString()
//     clinicName: string;
//     @IsString()
//     clinicAddress: string;
//     @IsString()
//     city: string;
//     @IsString()
//     state: string;
//     @IsString()
//     eveningEndTime: string;
//     @IsString()
//     eveningStartTime: string;
//     @IsString()
//     morningEndTime: string;
//     @IsString()
//     morningStartTime: string;

//     @IsNumber()
//     pinCode: number;

//     cordinates:Coordinates;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class ClinicDetails extends Document {
  @Prop({ required: true })
  clinicName: string;

  @Prop({ required: true })
  clinicAddress: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  @IsOptional()
  eveningEndTime: string;

  @Prop()
  @IsOptional()
  eveningStartTime: string;

  @Prop()
  @IsOptional()
  morningEndTime: string;

  @Prop()
  @IsOptional()
  morningStartTime: string;

  @Prop({ required: true })
  slotDuration: number;

  //   @Prop({
  //     type: {
  //       type: String,
  //       enum: ['Point'], // GeoJSON type
  //       required: true,
  //     },
  //     coordinates: {
  //       type: [Number], // [longitude, latitude]
  //       required: true,
  //     },
  //   })
  //   location: {
  //     type: 'Point';
  //     coordinates: [number, number]; // [longitude, latitude]
  //   };
}

export const ClinicDetailsSchema = SchemaFactory.createForClass(ClinicDetails);
ClinicDetailsSchema.index({ location: '2dsphere' });

// Create a 2dsphere index on the location field
