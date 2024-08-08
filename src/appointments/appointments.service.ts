import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const newAppointment = new this.appointmentModel(createAppointmentDto);
      return await newAppointment.save();
    } catch (error) {
      throw new ConflictException('An error occurred while creating the appointment.');
    }
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentModel.find().populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
    .populate('patient', 'name email mobileNo gender') // Only return selected fields from the patient document
    .exec();

  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
    .populate('patient', 'name email mobileNo gender') // Only return selected fields from the patient document
    .exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return appointment;
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true }).populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
      .populate('patient', 'name email mobileNo gender') // Only return selected fields from the patient document
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    const result = await this.appointmentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return { message: `Appointment with ID "${id}" deleted successfully` };
  }
}
