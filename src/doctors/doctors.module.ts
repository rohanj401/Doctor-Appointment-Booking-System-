import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from 'src/schemas/doctor.schema';
import { DoctorSchema } from 'src/schemas/doctor.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
