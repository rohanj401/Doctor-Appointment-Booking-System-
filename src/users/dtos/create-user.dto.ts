import { Prop } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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
  mobileNo: string;

  @IsString()
  @IsOptional()
  registration_no: string;

  @IsString()
  @IsOptional()
  year_of_registration: string;

  @IsString()
  @IsOptional()
  state_medical_council: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  document?: Express.Multer.File;

  @IsOptional()
  profilePic?: Express.Multer.File;
}
