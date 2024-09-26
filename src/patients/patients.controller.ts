import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import mongoose from 'mongoose';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}
  @Post()
  createUser(@Body() createpatientDto: CreatePatientDto) {
    console.log(createpatientDto);
    return this.patientsService.createPatient(createpatientDto);
  }

  @Get('/allPatients')
  getPatients() {
    console.log('Fetching All Patients');
    return this.patientsService.getPatients();
  }
  @Get('/fetchPatientByUserId/:id')
  async fetchPatientByUserId(@Param('id') id: string) {
    return this.patientsService.fetchPatientByUserId(id);
  }
  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    const patient = await this.patientsService.getPatientById(id);
    if (!patient) throw new HttpException('Patient Not Found ', 404);
    console.log('Patient is :', patient);
    return patient;
  }

  @Patch(':id')
  @Roles(Role.Patient)
  updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    return this.patientsService.updateUser(id, updatePatientDto);
  }

  @Public()
  @Roles(Role.Admin, Role.Patient)
  @Delete(':id')
  async deletePatient(@Param('id') id: string): Promise<void> {
    return this.patientsService.deletePatient(id);
  }
}
