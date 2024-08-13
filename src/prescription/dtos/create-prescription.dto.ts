import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MedicineDto {
  @IsNotEmpty()
  @IsString()
  medicineName: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  dosage: string[];

  @IsNotEmpty()
  @IsString()
  time: string;
}

export class CreatePrescriptionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineDto)
  medicine: MedicineDto[];

  @IsOptional()
  @IsString()
  updateReason?: string;

  @IsNotEmpty()
  @IsString()
  doctor: string;

  @IsNotEmpty()
  @IsString()
  patient: string;
}