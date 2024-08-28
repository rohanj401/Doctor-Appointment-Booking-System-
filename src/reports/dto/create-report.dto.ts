// create-report.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReportDto {
  @IsNotEmpty()
  doctor_id: Types.ObjectId;

  @IsNotEmpty()
  patient_id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  reportName: string;

  @IsNotEmpty()
  @IsString()
  uploadReport: string;

  @IsOptional()
  @IsString()
  comment: string;
}
