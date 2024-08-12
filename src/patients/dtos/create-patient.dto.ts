import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePatientDto {

  name: string;
  @IsPhoneNumber()
  mobileNo: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  @IsString()
  state: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsNumber()
  zipcode: number;
  @IsNotEmpty()
  @IsString()
  blood_group: string;
  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @IsString()
  profilePic: string;



}
