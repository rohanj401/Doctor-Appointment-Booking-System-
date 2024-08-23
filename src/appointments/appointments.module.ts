import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { AppointmentSchema } from 'src/schemas/Appointment.schema';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Slot.name, schema: SlotSchema },
    ]),
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService], // Export if needed in other modules
})
export class AppointmentsModule {}
