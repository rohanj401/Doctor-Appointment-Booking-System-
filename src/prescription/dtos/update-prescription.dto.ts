import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescriptionDto } from './create-prescription.dto';


export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
