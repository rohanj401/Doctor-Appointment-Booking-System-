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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/guards/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}
  @Post('/bookSlot')
  @Roles(Role.Patient)
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
  @Public()
  @Get()
  async getAllAppointments(@Query('filter') filter: string): Promise<any[]> {
    const query = filter ? JSON.parse(filter) : {};
    return this.appointmentsService.getAppointments(query);
  }

  @Public()
  @Get('/findAppointmentsByPatientId/:id')
  async findAppointmentsByPatientId(@Param('id') id: string) {
    console.log('Received patient ID:', id);
    return this.appointmentsService.findAppointmentsByPatientIdAndStatus(
      id,
      'accepted',
    );
  }
  @Get('/getAppointmentsByDoctorId')
  async getAppointments(@Query('doctorId') doctorId: string): Promise<any[]> {
    console.log(`Fetching appointments by doctorId : ${doctorId}`);
    return this.appointmentsService.findAppointmentsByDoctorId(doctorId);
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
