import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { AppointmentSchema } from 'src/schemas/Appointment.schema';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService], // Export if needed in other modules

})
export class AppointmentsModule {}
