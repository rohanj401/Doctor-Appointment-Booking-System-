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
import { Slot } from 'src/schemas/Slot.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Slot.name) private readonly slotModel: Model<Slot>,
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

  async findAppointmentsByDoctorId(doctorId: string): Promise<any[]> {
    console.log(`Fetching appointments by doctorId: ${doctorId}`);

    // Fetch appointments and populate patient and slot details
    const appointments = await this.appointmentModel
      .find({ doctor: new Types.ObjectId(doctorId) })
      .populate({
        path: 'patient',
        select: 'profilePic name contactNumber email _id', // Ensure these fields are included
      })
      .populate('slot') // Populate slot details (if necessary)
      .exec();

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException('No appointments found for this doctor');
    }

    // Fetch additional details for each appointment
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = appointment.patient as any; // Use populated patient
        const slot = appointment.slot as any; // Use populated slot (if available)
        const doctor = await this.doctorModel
          .findById(appointment.doctor)
          .exec();

        // Find the slot details from the doctor's availability
        const availability = doctor?.availability.find(
          (av) =>
            new Date(av.date).toISOString().split('T')[0] ===
            appointment.appointmentDate.toISOString().split('T')[0],
        );

        const slotDetails = availability?.slots.find(
          (s) => s._id.toString() === appointment.slot.toString(), // Ensure _id comparison
        );

        return {
          date: appointment.appointmentDate.toISOString().split('T')[0],
          appointmentsBooked: [
            {
              slotId: appointment.slot.toString(),
              time: slotDetails?.time,
              patient: {
                patientId: patient?._id, // Include patientId
                name: patient?.name,
                contactNumber: patient?.contactNumber,
                profilePic: patient?.profilePic,
                email: patient?.email,
              },
            },
          ],
        };
      }),
    );

    // Reorganize the appointments into a grouped format
    const groupedAppointments: any[] = [];
    const dateMap: { [key: string]: any[] } = {};

    appointmentsWithDetails.forEach((appointment) => {
      const { date, appointmentsBooked } = appointment;

      if (!dateMap[date]) {
        dateMap[date] = [];
      }

      dateMap[date].push(...appointmentsBooked);
    });

    for (const date in dateMap) {
      groupedAppointments.push({
        date,
        appointmentsBooked: dateMap[date],
      });
    }

    console.log(JSON.stringify(groupedAppointments[0]));
    return groupedAppointments;
  }

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
