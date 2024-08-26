import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionModule {}
