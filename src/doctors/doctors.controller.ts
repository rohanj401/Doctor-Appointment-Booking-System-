import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreatePatientDto } from 'src/patients/dtos/create-patient.dto';
import { UpdatePatientDto } from 'src/patients/dtos/update-patient.dto';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}
  @Post()
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    console.log(createDoctorDto);
    return this.doctorsService.createDoctor(createDoctorDto);
  }

  @Get()
  getPatients() {
    return this.doctorsService.getDoctors();
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Doctor Not Found', 404);
    const doctor = await this.doctorsService.getDoctorById(id);
    // if (!doctor) throw new HttpException('Doctor Not Found ', 404);
    // return doctor;
  }

  @Patch(':id')
  updatePatient(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Doctor Not Found', 404);
    return this.doctorsService.updateDoctor(id, updateDoctorDto);
  }
}
