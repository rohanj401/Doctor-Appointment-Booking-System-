import { IsDate, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CreateAppointmentDto } from './create-appointment.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
 