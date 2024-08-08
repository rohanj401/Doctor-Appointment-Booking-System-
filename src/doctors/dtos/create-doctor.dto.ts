import { IsBoolean, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 128)
  password: string;

  @IsString()
  speciality: string;

  @IsString()
  qualification: string;

  @IsString()
  @IsMobilePhone()
  mobileNo: string;

  @IsString()
  registration_no: string;

  @IsString()
  year_of_registration: string;

  @IsString()
  state_medical_council: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  document?:Express.Multer.File;

  profilepic?:Express.Multer.File
}
