import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class Address {
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
  pinCode: number;

   
}