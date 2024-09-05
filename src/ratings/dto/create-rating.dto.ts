import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsMongoId()
  doctor: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  patient: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  appointment: Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: string;

  @IsOptional()
  @IsString()
  comment: string;
}
