import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from 'src/schemas/doctor.schema';
import { DoctorSchema } from 'src/schemas/doctor.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }, { name: User.name, schema: UserSchema },])],
  controllers: [DoctorsController],
  providers: [DoctorsService,CloudinaryService],
})
export class DoctorsModule {}
