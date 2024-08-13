import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  name: string;
  @IsPhoneNumber()
  mobileNo: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;
  @IsNotEmpty()
  @IsString()
  gender: string;

  // @IsNotEmpty()
  // @IsString()
  // age: string;

  @IsNotEmpty()
  @IsString()
  profilePic: string;
}
