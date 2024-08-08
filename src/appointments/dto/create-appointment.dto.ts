import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsMongoId()
  doctor: Types.ObjectId;

  @IsMongoId()
  patient: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  appointment_date: Date;

  @IsEnum(['pending', 'accepted', 'rejected', 'completed', 'cancelled'])
  status?: string;
}
