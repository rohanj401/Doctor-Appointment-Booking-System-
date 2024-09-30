import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientsService: PatientsService,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorsService: DoctorsService,
  ) {}
  async bookSlot(
    doctorId: Types.ObjectId,
    patientId: Types.ObjectId,
    slotId: Types.ObjectId,
    appointmentDate: Date,
  ): Promise<void> {
    try {
      // Find the doctor by ID
      const doctor = await this.doctorsService.getDoctorById(
        doctorId.toString(),
      );
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
      .find({
        doctor: new Types.ObjectId(doctorId),
        status: { $in: ['accepted', 'completed'] },
      })
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
        const doctor = await this.doctorsService.getDoctorById(
          appointment.doctor.toString(),
        );

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
              status: appointment.status,
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

    return groupedAppointments;
  }

  async getAppointments(query: any = {}): Promise<Appointment[]> {
    if (query.appointmentDate && query.appointmentDate['$gte']) {
      query.appointmentDate['$gte'] = new Date(query.appointmentDate['$gte']);
    }
    if (query.patient) {
      query.patient = new Types.ObjectId(query.patient);
    }
    return this.appointmentModel
      .find(query)
      .populate('doctor')
      .populate('patient')
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
  async findAppointmentsByPatientIdAndStatus(
    patientId: string,
    status: string,
  ) {
    try {
      const patientIdObject = new mongoose.Types.ObjectId(patientId);

      const appointments = await this.appointmentModel.find({
        patient: patientIdObject,
        status: status,
      });
      return appointments;
    } catch (error) {
      console.log(error);
    }
  }

  async findCompletedAppointment(
    doctorId: string | Types.ObjectId,
    patientId: string | Types.ObjectId,
  ): Promise<Appointment | null> {
    const doctorObjectId =
      typeof doctorId === 'string' ? new Types.ObjectId(doctorId) : doctorId;
    const patientObjectId =
      typeof patientId === 'string' ? new Types.ObjectId(patientId) : patientId;

    // Find one appointment that matches the doctor, patient, and completed status
    const appointment = await this.appointmentModel
      .findOne({
        doctor: doctorObjectId,
        patient: patientObjectId,
        status: 'completed',
      })
      .exec();

    return appointment;
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate('doctor', 'name email speciality qualification gender')
      .populate('patient', 'name email mobileNo gender')
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return updatedAppointment;
  }

  async findAppointmentByDoctorDateAndSlot(
    doctorId: mongoose.Types.ObjectId,
    appointmentDate: string,
    slotId: mongoose.Types.ObjectId,
  ) {
    try {
      const appointment = await this.appointmentModel
        .findOne({
          doctor: doctorId,
          appointmentDate: appointmentDate, // Ensure this is the ISO date string
          slot: slotId,
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: 'email', // Only select the 'email' field from the user
          },
        })
        .exec();

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      return appointment;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw new InternalServerErrorException('Error fetching appointment');
    }
  }

  async updateAppointmentStatusToCompleted(
    slotId: Types.ObjectId,
    status: string,
  ): Promise<void> {
    await this.appointmentModel.updateOne(
      { slot: slotId }, // Use slotId to find the appointment
      { $set: { status: status } }, // Update the status of the appointment
    );
  }
  async findAppointmentsByDoctorAndDate(
    doctorId: string,
    appointmentDate: string,
  ): Promise<Appointment[]> {
    try {
      const doctorObjectId = new Types.ObjectId(doctorId);
      const appointments = await this.appointmentModel
        .find({
          doctor: doctorObjectId,
          appointmentDate: appointmentDate,
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
          },
        })
        .exec();
      return appointments;
    } catch (error) {
      // Handle error appropriately
      throw new Error('Error finding appointments');
    }
  }
  async deleteAppointment(id: string): Promise<{ message: string }> {
    const result = await this.appointmentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }
    return { message: `Appointment with ID "${id}" cancelled successfully` };
  }

  async deleteAppointmentsByPatientId(patientId: string) {
    const patient = await this.patientsService.getPatientById(
      patientId.toString(),
    );
    if (!patient) {
      throw new NotFoundException('Patient not found');
    } else {
      await this.appointmentModel.deleteMany({
        patient: new mongoose.Types.ObjectId(patientId),
      });
    }
  }
}
