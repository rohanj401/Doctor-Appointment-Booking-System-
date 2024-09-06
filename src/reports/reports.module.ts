import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reports } from 'src/schemas/Reports.schema';
import { ReportsSchema } from 'src/schemas/Reports.schema';
import { Patient, PatientSchema } from 'src/schemas/Patient.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reports.name, schema: ReportsSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
