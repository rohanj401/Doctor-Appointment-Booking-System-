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
  import { Types } from 'mongoose';
  import { AppointmentsService } from './appointments.service';
  import { CreateAppointmentDto } from './dto/create-appointment.dto';
  import { UpdateAppointmentDto } from './dto/update-appointment.dto';
  
  @Controller('appointments')
  export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) {}
  
    @Post()
    createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
      return this.appointmentsService.createAppointment(createAppointmentDto);
    }
  
    @Get()
    getAppointments() {
      return this.appointmentsService.getAppointments();
    }
  
    @Get(':id')
    async getAppointmentById(@Param('id') id: string) {
      const isValid = Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Appointment Not Found', 404);
      const appointment = await this.appointmentsService.getAppointmentById(id);
      if (!appointment) throw new HttpException('Appointment Not Found', 404);
      return appointment;
    }
  
    @Patch(':id')
    async updateAppointment(
      @Param('id') id: string,
      @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
      const isValid = Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Appointment Not Found', 404);
      return this.appointmentsService.updateAppointment(id, updateAppointmentDto);
    }
  
    @Delete(':id')
    async deleteAppointment(@Param('id') id: string) {
      const isValid = Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Appointment Not Found', 404);
      return this.appointmentsService.deleteAppointment(id);
    }
  }
  