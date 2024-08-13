import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Coordinates } from './coordinates';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateDoctorDto {


  
  user: mongoose.Types.ObjectId


  @IsString()
  speciality: string;

  @IsString()
  qualification: string;

  @IsString()
  @IsMobilePhone()
  contactNumber: string;

  @IsString()
  registrationNumber: string;

  @IsString()
  yearOfRegistration: string;

  @IsString()
  stateMedicalCouncil: string;

  @IsString()
  clinicAddress?: string;

  @IsString()
  clinicName: String;

  // @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  pinCode: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  coordinates?: Coordinates; // Add this line

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  // document?: Express.Multer.File;

  // profilePic?: Express.Multer.File;
  document: String;

  profilePic: String;
}
