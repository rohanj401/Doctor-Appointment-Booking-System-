import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';


import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { HttpModule } from '@nestjs/axios';

import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';

import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Admin, AdminSchema } from 'src/schemas/Admin.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Admin.name, schema: AdminSchema },

    ]),
    HttpModule,
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule { }
