import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { HttpModule } from '@nestjs/axios';

import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';

import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Admin, AdminSchema } from 'src/schemas/Admin.schema';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { UsersService } from 'src/users/users.service';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { PatientsService } from 'src/patients/patients.service';
import { RatingsService } from 'src/ratings/ratings.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    HttpModule,
  ],
  providers: [
    AdminService,
    AppointmentsService,
    DoctorsService,
    UsersService,
    PatientsService,
    RatingsService,
    PrescriptionService,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
