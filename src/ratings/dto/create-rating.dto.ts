import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsInt,
  Min,
  Max,
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
  @IsInt()
  @Min(1)
  @Max(5)
  rating: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
