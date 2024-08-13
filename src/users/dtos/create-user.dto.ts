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
import { Coordinates } from 'src/doctors/dtos/coordinates';

export class CreateUserDto {
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
  @IsOptional()
  speciality: string;

  @IsString()
  @IsOptional()
  qualification: string;

  @IsString()
  @IsOptional()
  // @IsMobilePhone()
  contactNumber: string;

  @IsString()
  @IsOptional()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  yearOfRegistration: string;

  @IsString()
  @IsOptional()
  stateMedicalCouncil: string;

  @IsString()
  @IsOptional()
  clinicAddress?: string;

  @IsString()
  @IsOptional()
  clinicName: String;

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  pinCode: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsOptional()
  coordinates?: Coordinates; // Add this line

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  // document?: Express.Multer.File;

  // profilePic?: Express.Multer.File;
  @IsOptional()
  document?: string;
  @IsOptional()
  profilePic?: string;

  //Patient Data

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;

  @IsNotEmpty()
  @IsString()
  gender: string;
  // @IsNotEmpty()
  // @IsString()
  // age: number;
}
