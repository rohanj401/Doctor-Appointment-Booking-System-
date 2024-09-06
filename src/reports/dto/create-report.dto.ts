// create-report.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReportDto {
  @IsNotEmpty()
  patient: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  reportName: string;

  @IsNotEmpty()
  @IsString()
  uploadReport: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  date: Date;

  @IsOptional()
  appointmentDate: Date;

  @IsOptional()
  doctor: Types.ObjectId;
}
