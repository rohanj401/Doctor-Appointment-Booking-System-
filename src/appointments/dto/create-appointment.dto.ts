import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsMongoId()
  doctorId: string; // Use string for ObjectId

  @IsMongoId()
  patientId: string; // Use string for ObjectId

  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @IsMongoId()
  slotId: string; // Use string for ObjectId

  @IsEnum(['pending', 'accepted', , 'completed', 'cancelled'])
  @IsOptional() // Make this optional if it's not always required
  status?: string; // Use string for status
}
