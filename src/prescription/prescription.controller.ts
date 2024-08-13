// prescription.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from './dtos/update-prescription.dto';
import { from } from 'rxjs';
import { query } from 'express';
import { Prescription } from 'src/schemas/Prescription.schema';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
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
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }
}
