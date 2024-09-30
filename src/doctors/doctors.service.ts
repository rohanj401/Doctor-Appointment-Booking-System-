import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Doctor } from '../schemas/doctor.schema';
import { Availability } from '../schemas/Availability.schema';
import { Slot } from '../schemas/Slot.schema';
import { CancelSlotDto } from './dtos/cancel-slot.dto';

import { MailerService } from '@nestjs-modules/mailer';

import * as Twilio from 'twilio';
import { generateAppointmentCancellationEmail } from '../EmailTemplates/appointmnetCamcellationEmailTemplate';
import { generateAppointmentCancellationSMS } from '../SMS_Templates/appointementCancellationSMS';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PatientsService } from 'src/patients/patients.service';
import { UsersService } from 'src/users/users.service';
import { RatingsService } from 'src/ratings/ratings.service';
// import { zonedTimeToUtc } from 'date-fns-tz';

@Injectable()
export class DoctorsService {
  private twilioClient: Twilio.Twilio;

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Slot.name) private slotModel: Model<Slot>,
    @InjectModel(Availability.name)
    private availabilityModel: Model<Availability>,
    private readonly mailerService: MailerService,
    private readonly appointmentsService: AppointmentsService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientsService: PatientsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly ratingsService: RatingsService,
  ) {
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async createDcotor(createDoctorDto: CreateDoctorDto) {
    return await new this.doctorModel(createDoctorDto);
  }
  async findDoctors(
    status: 'all' | 'verified' | 'unverified',
    page: number,
    pageSize: number,
  ) {
    const query: any = {};
    if (status === 'verified') {
      query.isVerified = true;
    } else if (status === 'unverified') {
      query.isVerified = false;
    }

    const [doctors, totalDoctors] = await Promise.all([
      this.doctorModel
        .find(query, "name profilePic yearOfRegistration speciality")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.doctorModel.countDocuments(query).exec(),
    ]);

    return {
      doctors,
      total: totalDoctors,
    };
  }

  async getDoctors(): Promise<(Doctor & { avgRating: number })[]> {
    // const doctors = await this.doctorModel.find({ isVerified: true }).exec();
    const doctors = await this.doctorModel.find({ isVerified: true }, "name speciality isVerified profilePic contactNumber").exec();
    const doctorsWithRatings: (Doctor & { avgRating: number })[] = [];

    for (const doctor of doctors) {
      const doctorObjectId =
        typeof doctor._id === 'string' && new Types.ObjectId(doctor._id);
      const averageRating = await this.ratingsService.getAverageRating(
        doctor._id.toString(),
      );
      const doctorObject = doctor.toObject() as Doctor & { avgRating: number };
      doctorObject.avgRating = averageRating;
      doctorsWithRatings.push(doctorObject);
    }

    return doctorsWithRatings;
  }

  async getDoctorById(id: string): Promise<Doctor> {

    const doctor = await this.doctorModel.findById(id)
      .select('name speciality qualification registrationNumber profilePic contactNumber bio document yearOfRegistration stateMedicalCouncil clinicDetails availability');

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }
    return doctor;
  }

  async fetchDoctorByUserId(userId: string) {
    const doctor = await this.doctorModel
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor with user ID ${userId} not found`);
    }

    return doctor;
  }

  async patchDoctor(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorModel.findOne({ _id: id }).exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor with user ID ${id} not found`);
    }

    return this.doctorModel.findByIdAndUpdate(id, updateDoctorDto);
  }

  async searchDoctors(
    state: string,
    city: string,
    speciality?: string,
    gender?: string,
    radiusInKm?: number,
    location?: [number, number], // [latitude, longitude]
  ) {
    // Initialize the query object
    const query: any = {
      'clinicDetails.state': state,
      'clinicDetails.city': city,
      isVerified: true,
    };

    if (speciality) {
      query.speciality = speciality;
    }

    if (gender) {
      query.gender = gender;
    }

    // **Combine geolocation filter within the same query object**
    if (radiusInKm && location) {
      const radiusInMeters = radiusInKm * 1000;
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [+location[0], +location[1]], // [longitude, latitude]
          },
          $minDistance: 0,
          $maxDistance: radiusInMeters,
        },
      };
    }

    try {
      // **Use the query object directly with `find`**
      const response = await this.doctorModel.find(query).exec();
      const doctorsWithRatings: (Doctor & { avgRating: number })[] = [];

      for (const doctor of response) {
        const averageRating = await this.ratingsService.getAverageRating(
          doctor._id.toString(),
        );
        const doctorObject = doctor.toObject() as Doctor & {
          avgRating: number;
        };
        doctorObject.avgRating = averageRating;

        doctorsWithRatings.push(doctorObject);
      }
      return doctorsWithRatings;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Error fetching doctors');
    }
  }

  async disableDoctor(doctorId: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    doctor.isVerified = false;
    await doctor.save();

    return doctor;
  }

  async verifyDoctor(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    doctor.isVerified = true;
    await doctor.save();

    return doctor;
  }

  async fetchAvailableDates(doctorId: string) {
    const doctor = await this.doctorModel.findById(doctorId).exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    return doctor.availability; // Adjust the field name if needed
  }

  async addAvailability(data: any): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(data.doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    const timePerSlot = data.timePerSlot;
    const newAvailabilityPromises = data.dates.map((date: string) => {
      const slots = this.generateSlotsForDay(date, timePerSlot, doctor);
      // return;
      return this.availabilityModel.create({ date, slots });
    });


    const newAvailability = await Promise.all(newAvailabilityPromises);

    doctor.availability.push(...newAvailability);
    await doctor.save();

    return doctor;
  }

  private generateSlotsForDay(
    date: string,
    timePerSlot: number,
    doctor: Doctor, // Pass the doctor object to access clinicDetails
  ): Slot[] {
    const slots: Slot[] = [];
    const clinicDetails = doctor.clinicDetails;

    // Extract timings from clinicDetails
    const morningStart = this.convertTimeToMinutes(
      clinicDetails.morningStartTime,
    );
    const morningEnd = this.convertTimeToMinutes(clinicDetails.morningEndTime);
    const eveningStart = this.convertTimeToMinutes(
      clinicDetails.eveningStartTime,
    );
    const eveningEnd = this.convertTimeToMinutes(clinicDetails.eveningEndTime);

    // Generate morning slots if timings are available
    if (morningStart !== undefined && morningEnd !== undefined) {
      slots.push(
        ...this.generateSlotsForPeriod(morningStart, morningEnd, timePerSlot),
      );
    }

    // Generate evening slots if timings are available
    if (eveningStart !== undefined && eveningEnd !== undefined) {
      slots.push(
        ...this.generateSlotsForPeriod(eveningStart, eveningEnd, timePerSlot),
      );
    }

    return slots;
  }

  private generateSlotsForPeriod(
    startTime: number,
    endTime: number,
    timePerSlot: number,
  ): Slot[] {
    const slots: Slot[] = [];

    for (let time = startTime; time < endTime; time += timePerSlot) {
      const hours = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
      const minutes = (time % 60).toString().padStart(2, '0');
      const slotTime = `${hours}:${minutes}`;

      slots.push(
        new this.slotModel({
          time: slotTime,
          status: 'available',
        }),
      );
    }

    return slots;
  }

  private convertTimeToMinutes(time: string): number | undefined {
    if (!time) return undefined;

    const [hours, minutes] = time.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  }

  async cancelSlot(cancelSlotDto: CancelSlotDto): Promise<void> {
    const { doctorId, date, slotId } = cancelSlotDto;
    console.log(`Cancelling a slot on date ${date}`);

    // Convert date to ISO string format for MongoDB query
    const isoDate = new Date(date).toISOString().split('T')[0];
    console.log(`Doctor ID: ${doctorId}, Date: ${isoDate}, Slot ID: ${slotId}`);

    // Convert IDs to ObjectId
    const doctorObjectId = new Types.ObjectId(doctorId);
    const slotObjectId = new Types.ObjectId(slotId);

    // Update the slot's status to 'cancelled' in the specified date
    const result = await this.doctorModel.updateOne(
      {
        _id: doctorObjectId,
        'availability.date': isoDate,
        'availability.slots._id': slotObjectId,
      },
      {
        $set: {
          'availability.$.slots.$[slot].status': 'cancelled',
        },
      },
      {
        arrayFilters: [{ 'slot._id': slotObjectId }],
        multi: true,
      },
    );
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    console.log(`Matched Count: ${result.matchedCount}`);
    console.log(`Modified Count: ${result.modifiedCount}`);

    if (result.matchedCount === 0) {
      throw new NotFoundException('Slot or Doctor not found');
    }

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Slot status was not updated');
    } else if (result.modifiedCount > 0) {
      const appointment =
        await this.appointmentsService.findAppointmentByDoctorDateAndSlot(
          doctorObjectId,
          isoDate,
          slotObjectId,
        );

      if (!appointment) {
        console.log('No appointment found for the slot');
        return; // Early return if no appointment exists
      }
      appointment.status = 'cancelled';
      await appointment.save();

      const doctor = await this.doctorModel.findById(cancelSlotDto.doctorId);
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      // const patient = await this.patientModel.findById(appointment.patient._id);
      const patient = await this.patientsService.getPatientById(
        appointment.patient._id.toString(),
      );
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }
      console.log(
        'sending Appointmnet Cancellation message to :',
        patient.contactNumber,
      );
      const SMS_Content = generateAppointmentCancellationSMS(
        patient.name,
        doctor.name,
        formattedDate,
      );
      await this.twilioClient.messages.create({
        body: SMS_Content,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: patient.contactNumber,
      });

      // Send the email asynchronously after the slot has been cancelled
      this.sendCancellationEmail(doctor, patient, formattedDate).catch((err) =>
        console.error('Error sending cancellation email:', err),
      );
    }
  }

  async checkIfDoctorExists(doctorId: string) {
    const res = await this.doctorModel.exists({ _id: doctorId });
    return res;
  }

  private async sendCancellationEmail(
    doctor: any,
    patient: any,
    formattedDate: string,
  ): Promise<void> {
    const user = await this.usersService.getUserById(patient.user);
    if (user) {
      const emailContent = generateAppointmentCancellationEmail(
        patient.name,
        formattedDate,
        doctor.name,
      );
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Appointment Cancellation Notice!',
        html: emailContent,
      });
    }
  }

  async cancelAllSlots(doctorId: string, date: Date): Promise<any> {
    try {
      const isoDate = date.toISOString().split('T')[0];
      const isoDate1 = date.toISOString();

      console.log('Cancelling all slots');

      const doctor = await this.doctorModel.findById(doctorId);
      if (!doctor) {
        return { message: 'Doctor not found' };
      }

      const availabilityIndex = doctor.availability.findIndex(
        (avail) => avail.date === date.toISOString().split('T')[0],
      );

      if (availabilityIndex === -1) {
        return { message: 'No availability found for the given date' };
      }

      doctor.availability.splice(availabilityIndex, 1);
      await doctor.save();
      console.log(
        `Availability removed for date: ${date.toISOString().split('T')[0]}`,
      );

      const appointments =
        await this.appointmentsService.findAppointmentsByDoctorAndDate(
          doctorId,
          isoDate,
        );

      if (appointments.length === 0) {
        console.log('No appointments found for the slot');
        return { message: 'No appointments found for the given date' };
      }

      // Send response immediately
      const response = {
        message: 'All slots canceled successfully and date removed',
      };

      // Send notification emails to all patients with appointments on that date
      this.sendCancellationEmailsAndSms(appointments, doctor);

      return response;
    } catch (error) {
      throw new Error(`Error canceling all slots: ${error.message}`);
    }
  }

  async deleteDoctorByUserId(userId) {
    await this.doctorModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  }

  // Method to send cancellation emails in the background
  private async sendCancellationEmailsAndSms(appointments: any[], doctor: any) {
    try {
      for (const appointment of appointments) {
        appointment.status = 'cancelled';
        await appointment.save();
        const patient = appointment.patient;
        if (patient) {
          const formattedDate = new Date(
            appointment.appointmentDate,
          ).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const SMS_Content = generateAppointmentCancellationSMS(
            patient.name,
            doctor.name,
            formattedDate,
          );
          await this.twilioClient.messages.create({
            body: SMS_Content,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: patient.contactNumber,
          });
          const user = patient.user;
          if (user) {
            const appointmentDate = new Date(
              appointment.appointmentDate,
            ).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const emailContent = generateAppointmentCancellationEmail(
              patient.name,
              appointmentDate,
              doctor.name,
            );
            await this.mailerService.sendMail({
              to: user.email,
              subject: 'Appointment Cancellation Notice!',
              html: emailContent,
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error sending cancellation emails: ${error.message}`);
    }
  }

  async updateSlotStatusWhileDeletePatient(
    doctorId: Types.ObjectId,
    date: string,
    slotId: Types.ObjectId,
  ) {
    try {
      const result = await this.doctorModel.updateOne(
        {
          _id: doctorId,
          'availability.date': date,
          'availability.slots._id': slotId,
        },
        {
          $set: {
            'availability.$.slots.$[slot].status': 'available',
          },
        },
        {
          arrayFilters: [{ 'slot._id': slotId }],
        },
      );
      if (result.modifiedCount === 0) {
        console.error(
          'No slots updated. Check if the slot exists and is correct.',
        );
      }
    } catch (error) {
      console.error('Error updating slot status:', error);
    }
  }
}
