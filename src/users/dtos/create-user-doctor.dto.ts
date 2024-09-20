import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Coordinates } from '../../doctors/dtos/coordinates';

export class CreateUserDoctorDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean = false;

  // extra fields for doctor

  @IsString()
  speciality: string;

  @IsString()
  qualification: string;

  @IsString()
  // @IsMobilePhone()
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

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  pinCode: number;

  @IsString()
  bio?: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsOptional()
  coordinates?: Coordinates; // Add this line

  @IsNumber()
  slotDuration: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  eveningStartTime: string;

  @IsOptional()
  @IsString()
  eveningEndTime: string;

  @IsOptional()
  @IsString()
  morningStartTime: string;

  @IsOptional()
  @IsString()
  morningEndTime: string;

  document?: string;
  @IsOptional()
  profilePic?: string;
}
