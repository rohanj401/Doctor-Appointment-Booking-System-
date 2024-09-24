import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { Prescription, PrescriptionSchema } from 'src/schemas/Prescription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Patient.name,
        schema: PatientSchema,
      },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Prescription.name, schema: PrescriptionSchema }

    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule { }
