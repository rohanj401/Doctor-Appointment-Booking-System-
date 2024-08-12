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
  document?: string;

  profilePic?: string;
}
