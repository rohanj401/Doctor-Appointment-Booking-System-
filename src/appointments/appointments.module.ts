import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { AppointmentSchema } from 'src/schemas/Appointment.schema';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { PatientsService } from 'src/patients/patients.service';
import { User, UserSchema } from 'src/schemas/User.schema';
import { UsersService } from 'src/users/users.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { RatingsService } from 'src/ratings/ratings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: User.name, schema: UserSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  providers: [
    AppointmentsService,
    PatientsService,
    UsersService,
    PrescriptionService,
    DoctorsService,
    RatingsService,
  ],
  controllers: [AppointmentsController],
  exports: [AppointmentsService], // Export if needed in other modules
})
export class AppointmentsModule {}
