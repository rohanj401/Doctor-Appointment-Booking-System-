import { IsNumber, IsString } from 'class-validator';
import { Coordinates } from './coordinates';

export class ClinicDetails {
    @IsString()
    clinicName: string;
    @IsString()
    clinicAddress: string;
    @IsString()
    city: string;
    @IsString()
    state: string;
    @IsString()
    eveningEndTime: string;
    @IsString()
    eveningStartTime: string;
    @IsString()
    morningEndTime: string;
    @IsString()
    morningStartTime: string;

    @IsNumber()
    pinCode: number;

    cordinates:Coordinates;
}
