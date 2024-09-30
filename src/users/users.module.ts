import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { HttpModule } from '@nestjs/axios';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { PatientsService } from 'src/patients/patients.service';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { DoctorsService } from 'src/doctors/doctors.service';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { RatingsService } from 'src/ratings/ratings.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Slot.name, schema: SlotSchema },
    ]),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PatientsService,
    DoctorsService,
    AppointmentsService,
    PrescriptionService,
    RatingsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
