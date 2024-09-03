// prescription.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from './dtos/update-prescription.dto';
import { Types } from 'mongoose';

import { from } from 'rxjs';
import { query } from 'express';
import { Medicine, Prescription } from 'src/schemas/Prescription.schema';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) { }

  @Get('/findPrescriptionByPatientAndDoctor')
  async findPrescriptionByPatientAndDoctor(
    @Query('patientId') patientId: string,
    @Query('doctorId') doctorId: string,
  ) {
    try {

      return await this.prescriptionService.findPrescriptionByPatientIdAndDoctorId(patientId, doctorId);
    } catch (error) {
      console.error('Error finding prescription:', error);
      throw new Error(`Error finding prescription: ${error.message}`);
    }
  }

  @Get('/byPatient')
  async getPrescriptionsByPatientId(@Query('patientId') patientId: string) {
    console.log(patientId);
    if (!patientId) {
      throw new BadRequestException('Patient ID is required');
    }
    const prescriptions =
      await this.prescriptionService.findByPatientId(patientId);
    if (!prescriptions || prescriptions.length === 0) {
      throw new NotFoundException('No prescriptions found for this patient');
    }
    return prescriptions;
  }


  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }
  @Post('/save')
  async savePrescription(
    @Body()
    prescriptionDto: {
      patientId: string;
      doctorId: string;
      doctorName: string;
      patientName: string;
      note: string;
      medicines: {
        name: string;
        dosage: string[];
        time: string;
        days: number;
      }[];
      appointmentDate: string;
      slotId: string;
    },
  ): Promise<Prescription> {
    // Log the incoming request body for debugging
    console.log('Saving prescription:', prescriptionDto);
    try {
      const transformedPrescriptionDto = {
        ...prescriptionDto,
        doctorId: new Types.ObjectId(prescriptionDto.doctorId),
        patientId: new Types.ObjectId(prescriptionDto.patientId),
        appointmentDate: new Date(prescriptionDto.appointmentDate),
        slotId: new Types.ObjectId(prescriptionDto.slotId),
      };
      return this.prescriptionService.savePrescription(prescriptionDto);
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }

  }


  @Get()
  async findAll(@Query() query: any): Promise<Prescription[]> {
    return this.prescriptionService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }



  @Get('findPrescriptionByDoctorId/:id')
  async findPrescriptionByDoctorId(@Param('id') id: string) {
    console.log('from doctor controller', id);
    return this.prescriptionService.findPrescriptionByDoctorId(id);
  }






}