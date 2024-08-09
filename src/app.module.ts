import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Patient, PatientSchema } from './schemas/Patient.schema';
import { HttpModule } from '@nestjs/axios';
import * as bodyParser from 'body-parser';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/doctor_appointment_booking',
    ),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    PatientsModule,
    DoctorsModule,
    UsersModule,
    AppointmentsModule,
    // UploadModule,
    // UploadModule,
    CloudinaryModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
