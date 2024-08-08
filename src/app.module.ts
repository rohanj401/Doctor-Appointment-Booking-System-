import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { UploadController } from './upload/upload.controller';
import { ConfigModule } from '@nestjs/config';
import { Doctor } from './schemas/doctor.schema';
import { DoctorSchema } from './schemas/doctor.schema';
import { Patient } from './schemas/Patient.schema';
import { PatientSchema } from './schemas/Patient.schema';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
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
   
  ],
   controllers: [AppController],
   providers: [AppService,CloudinaryService],
})
export class AppModule {}
