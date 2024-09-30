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
import { PatientsService } from 'src/patients/patients.service';
import { User, UserSchema } from 'src/schemas/User.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { DoctorsService } from 'src/doctors/doctors.service';
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
  ],
  controllers: [PrescriptionController],
  providers: [
    PrescriptionService,
    PatientsService,
    UsersService,
    AppointmentsService,
    DoctorsService,
    RatingsService,
  ],
})
export class PrescriptionModule {}
