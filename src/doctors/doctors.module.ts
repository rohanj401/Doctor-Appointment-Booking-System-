import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from 'src/schemas/doctor.schema';
import { DoctorSchema } from 'src/schemas/doctor.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PatientsService } from 'src/patients/patients.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { UsersService } from 'src/users/users.service';
import { RatingsService } from 'src/ratings/ratings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [DoctorsController],
  providers: [
    DoctorsService,
    AppointmentsService,
    PatientsService,
    UsersService,
    PrescriptionService,
    RatingsService,
  ],
})
export class DoctorsModule {}
