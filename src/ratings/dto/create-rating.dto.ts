import { IsNotEmpty, IsMongoId, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsMongoId()
  doctor_id: string;

  @IsNotEmpty()
  @IsMongoId()
  patient_id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)  
  @Max(5)
  rating: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}


