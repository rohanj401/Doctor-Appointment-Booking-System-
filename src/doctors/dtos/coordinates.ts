import { IsNumber } from 'class-validator';

export class Coordinates {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
