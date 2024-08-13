import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateRatingDto } from './create-rating.dto';

export class UpdateRatingDto extends PartialType (CreateRatingDto) {}
