// src/slots/dto/cancel-slot.dto.ts

import { IsString, IsDateString } from 'class-validator';

export class CancelSlotDto {
  @IsString()
  doctorId: string;

  @IsDateString()
  date: string;

  @IsString()
  slotId: string;
}
