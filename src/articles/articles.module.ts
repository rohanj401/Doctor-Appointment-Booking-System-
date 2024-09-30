// src/articles/articles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from 'src/schemas/Articles.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { DoctorsService } from 'src/doctors/doctors.service';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PatientsService } from 'src/patients/patients.service';
import { RatingsService } from 'src/ratings/ratings.service';
import { UsersService } from 'src/users/users.service';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { Patient, PatientSchema } from 'src/schemas/patient.schema';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    DoctorsService,
    AppointmentsService,
    PatientsService,
    UsersService,
    RatingsService,
    PrescriptionService,
  ],
})
export class ArticlesModule {}
