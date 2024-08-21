import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/Patient.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
  ) {}
  async bookSlot(
    doctorId: Types.ObjectId,
    patientId: Types.ObjectId,
    slotId: Types.ObjectId,
    appointmentDate: Date,
  ): Promise<void> {
    try {
      // Find the doctor by ID
      const doctor = await this.doctorModel.findById(doctorId).exec();

      if (!doctor) {
        throw new NotFoundException('Doctor not found.');
      }

      // Find the availability object for the given date
      const availabilityIndex = doctor.availability.findIndex(
        (avail) =>
          new Date(avail.date).toDateString() ===
          new Date(appointmentDate).toDateString(),
      );

      if (availabilityIndex === -1) {
        throw new NotFoundException(
          'No availability found for the selected date.',
        );
      }

      const availability = doctor.availability[availabilityIndex];

      // Find the slot object within the availability array
      const slotIndex = await availability.slots.findIndex(
        (slot) => slot._id.toString() === slotId.toString(),
      );

      if (slotIndex === -1) {
        throw new NotFoundException('Slot not found.');
      }

      const slot = availability.slots[slotIndex];

      // Check if the slot is available
      if (slot.status !== 'available') {
        throw new Error('Slot is not available.');
      }

      // Book the slot
      slot.status = 'booked';

      // Update the doctor's document with the modified availability
      doctor.availability[availabilityIndex].slots[slotIndex] = slot;
      await doctor.save();

      // Optionally, create an appointment record
      const appointment = new this.appointmentModel({
        doctor: doctorId,
        patient: patientId,
        slot: slotId,
        appointmentDate,
        status: 'accepted',
      });
      await appointment.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // async createAppointment(
  //   createAppointmentDto: CreateAppointmentDto,
  // ): Promise<Appointment> {
  //   try {
  //     const newAppointment = new this.appointmentModel(createAppointmentDto);
  //     return await newAppointment.save();
  //   } catch (error) {
  //     throw new ConflictException(
  //       'An error occurred while creating the appointment.',
  //     );
  //   }
  // }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
      .populate('patient', 'name email mobileNo gender') // Only return selected fields from the patient document
      .exec();
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
      .populate('patient', 'name email mobileNo gender') // Only return selected fields from the patient document
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return appointment;
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate('doctor', 'name email speciality qualification gender') // Only return selected fields from the doctor document
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
