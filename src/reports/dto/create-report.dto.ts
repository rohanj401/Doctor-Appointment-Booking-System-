// create-report.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReportDto {
  @IsNotEmpty()
  doctor_id: Types.ObjectId;

  @IsNotEmpty()
  patient_id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  report: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
