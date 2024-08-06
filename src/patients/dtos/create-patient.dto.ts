import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePatientDto {
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
  blood_group: string;
  @IsNotEmpty()
  @IsString()
  gender: string;
}
