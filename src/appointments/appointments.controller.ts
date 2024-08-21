import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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

  // @Post()
  // createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
  //   return this.appointmentsService.createAppointment(createAppointmentDto);
  // }
  @Post('/bookSlot')
  @HttpCode(HttpStatus.OK)
  async bookSlot(@Body() createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, patientId, slotId, appointmentDate } =
      createAppointmentDto;

    // Convert string IDs to ObjectId
    const doctorIdd = new Types.ObjectId(doctorId);
    const patientIdd = new Types.ObjectId(patientId);
    const slotIdd = new Types.ObjectId(slotId);

    try {
      await this.appointmentsService.bookSlot(
        doctorIdd,
        patientIdd,
        slotIdd,
        new Date(appointmentDate),
      );
      return { message: 'Slot booked successfully!' };
    } catch (error) {
      return { message: error.message };
    }
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
