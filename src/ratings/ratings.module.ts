import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { DoctorsService } from 'src/doctors/doctors.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PatientsService } from 'src/patients/patients.service';
import { Slot, SlotSchema } from 'src/schemas/Slot.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schemas/Availability.schema';
import { UsersService } from 'src/users/users.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { User, UserSchema } from 'src/schemas/User.schema';
import {
  Prescription,
  PrescriptionSchema,
} from 'src/schemas/Prescription.schema';
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
    ]),

    // Import any other modules that provide required models or services
  ],
  providers: [
    RatingsService,
    DoctorsService,
    AppointmentsService,
    PatientsService,
    UsersService,
    PrescriptionService,
  ],
  controllers: [RatingController],
})
export class RatingsModule {}
/**MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ], */
