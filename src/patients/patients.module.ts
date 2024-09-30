import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import { UsersService } from 'src/users/users.service';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';

// Import the necessary modules
import { UsersModule } from 'src/users/users.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { DoctorsService } from 'src/doctors/doctors.service';
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
  ],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    AppointmentsService,
    UsersService,
    DoctorsService,
    PrescriptionService,
    RatingsService,
  ],
})
export class PatientsModule {}
