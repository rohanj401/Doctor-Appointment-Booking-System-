import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from 'src/schemas/Ratings.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/Appointment.schema';
import { AppointmentsModule } from 'src/appointments/appointments.module';
@Module({imports: [
  MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema },
    { name: Appointment.name, schema: AppointmentSchema },
  ]),
 
  // Import any other modules that provide required models or services
],
  providers: [RatingsService],
  controllers: [RatingController]
})
export class RatingsModule {}
/**MongooseModule.forFeature([
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ], */