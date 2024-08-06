import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsPhoneNumber()
  mobileNo: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  @IsString()
  speciality: string;
  @IsNotEmpty()
  @IsString()
  qualification: string;
  @IsNotEmpty()
  @IsString()
  registration_no: string;
  @IsNotEmpty()
  @IsString()
  year_of_registration: string;
  @IsNotEmpty()
  @IsString()
  state_medical_council: string;
  @IsNotEmpty()
  @IsString()
  bio: string;
  @IsNotEmpty()
  @IsString()
  is_verified: boolean;
}
