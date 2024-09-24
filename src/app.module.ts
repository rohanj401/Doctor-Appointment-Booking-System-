// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PatientsModule } from './patients/patients.module';
// import { DoctorsModule } from './doctors/doctors.module';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { Doctor, DoctorSchema } from './schemas/doctor.schema';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AppointmentsModule } from './appointments/appointments.module';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { CloudinaryService } from './cloudinary/cloudinary.service';
// import { Patient, PatientSchema } from './schemas/Patient.schema';
// import { HttpModule } from '@nestjs/axios';
// import * as bodyParser from 'body-parser';
// import { PrescriptionModule } from './prescription/prescription.module';
// import { RatingsModule } from './ratings/ratings.module';
// import { ReportsModule } from './reports/reports.module';
// import { ConfigModule } from '@nestjs/config';
// import configuration from './config/configurations';
// import { ArticlesModule } from './articles/articles.module';
// import { AdminModule } from './admin/admin.module';
// import { ContactController } from './contact/contact.controller';
// import { MailService } from './mail/mail.service';
// import { NotificationService } from './services/notificationScheduler';
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       load: [configuration],
//       isGlobal: true,
//     }),

//     MongooseModule.forRoot(
//       'mongodb://localhost:27017/doctor_appointment_booking',
//     ),
//     MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
//     MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
//     PatientsModule,
//     DoctorsModule,
//     UsersModule,
//     AppointmentsModule,
//     // UploadModule,
//     // UploadModule,
//     CloudinaryModule,
//     AuthModule,
//     HttpModule,
//     PrescriptionModule,
//     RatingsModule,
//     ReportsModule,
//     ArticlesModule,
//     AdminModule,
//   ],
//   controllers: [AppController, ContactController],
//   providers: [AppService, CloudinaryService, MailService, NotificationService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './schemas/user.schema'; // Ensure this is correct
import { AuthModule } from './auth/auth.module';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment, AppointmentSchema } from './schemas/Appointment.schema';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Patient, PatientSchema } from './schemas/Patient.schema';
import { HttpModule } from '@nestjs/axios';
import * as bodyParser from 'body-parser';
import { PrescriptionModule } from './prescription/prescription.module';
import { APP_GUARD } from '@nestjs/core';

import { RatingsModule } from './ratings/ratings.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configurations';
import { ArticlesModule } from './articles/articles.module';
import { AdminModule } from './admin/admin.module';
import { ContactController } from './contact/contact.controller';
import { MailService } from './mail/mail.service';
import { NotificationService } from 'src/services/notificationScheduler'; // Import the NotificationService
import { AuthGuard } from './auth/auth.gaurd';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb://localhost:27017/doctor_appointment_booking',
    ),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema }, // Ensure this line is correct
    ]), // Ensure Appointment is also imported

    PatientsModule,
    DoctorsModule,
    UsersModule,
    AppointmentsModule,
    CloudinaryModule,
    AuthModule,
    HttpModule,
    PrescriptionModule,
    RatingsModule,
    ReportsModule,
    ArticlesModule,
    AdminModule,
  ],
  controllers: [AppController, ContactController],
  providers: [
    AppService,
    CloudinaryService,
    MailService,
    NotificationService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ], // Add NotificationService here
})
export class AppModule {}
