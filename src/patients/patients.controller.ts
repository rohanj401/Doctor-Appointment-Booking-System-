import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import mongoose from 'mongoose';
import { UpdatePatientDto } from './dtos/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}
  @Post()
  createUser(@Body() createpatientDto: CreatePatientDto) {
    console.log(createpatientDto);
    return this.patientsService.createPatient(createpatientDto);
  }

  @Get()
  getPatients() {
    return this.patientsService.getPatients();
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    const patient = await this.patientsService.getPatientById(id);
    if (!patient) throw new HttpException('Patient Not Found ', 404);
    return patient;
  }

  @Patch(':id')
  updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    return this.patientsService.updateUser(id, updatePatientDto);
  }
  @Delete('user/:userId')
  async deletePatientByUserId(@Param('userId') userId: string) {
    return this.patientsService.deletePatientByUserId(userId);
  }
}
