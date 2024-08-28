import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/schemas/User.schema';
import { Availability } from 'src/schemas/Availability.schema';
import { Slot } from 'src/schemas/Slot.schema';
import { CancelSlotDto } from './dtos/cancel-slot.dto';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Patient } from 'src/schemas/Patient.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,

    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Slot.name) private slotModel: Model<Slot>,
    @InjectModel(Availability.name)
    private availabilityModel: Model<Availability>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    private readonly mailerService: MailerService,
  ) {}

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
        .find(query)
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
  async getDoctors(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }
    return doctor;
  }

  async fetchDoctorByUserId(userId: string) {
    console.log('getting doctor by userId');
    const doctor = await this.doctorModel
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor with user ID ${userId} not found`);
    }

    return doctor;
  }

  async findNearbyDoctors(data: any) {
    console.log(data.userLatitude);
    console.log(data.userLongitude);
    const radiusInMeters = data.radiusInKm * 1000;
    console.log(radiusInMeters);
    return await this.doctorModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [data.userLatitude, data.userLongitude],
          },
          $minDistance: 0,
          $maxDistance: radiusInMeters,
        },
      },
    });
  }

  async searchDoctors(
    state: string,
    city: string,
    speciality?: string,
    gender?: string,
    radiusInKm?: number,
    location?: [number, number], // [latitude, longitude]
  ) {
    console.log(
      'from search doctor service',
      state,
      city,
      speciality,
      gender,
      radiusInKm,
      location,
    );

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

    console.log('Query is :', JSON.stringify(query));

    try {
      // **Use the query object directly with `find`**
      const response = await this.doctorModel.find(query).exec();
      console.log('Doctors found:', response);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Error fetching doctors');
    }
  }

  // async updateDoctor(
  //   id: string,
  //   updateDoctorDto: UpdateDoctorDto,
  // ): Promise<Doctor> {
  //   let doctor = { ...updateDoctorDto } as any;
  //   if (updateDoctorDto.document) {
  //     let document = await this.cloudinaryService.uploadImage(
  //       updateDoctorDto.document,
  //     );
  //     delete updateDoctorDto.document;
  //     doctor.documentUrl = document.secure_url;
  //   }

  //   if (updateDoctorDto.profilePic) {
  //     let profilePic = await this.cloudinaryService.uploadImage(
  //       updateDoctorDto.profilePic,
  //     );
  //     delete updateDoctorDto.profilePic;
  //     doctor.profilePic = profilePic.secure_url;
  //   }

  //   const updatedDoctor = await this.doctorModel
  //     .findByIdAndUpdate(id, doctor, { new: true })
  //     .exec();

  //   if (!updatedDoctor) {
  //     throw new NotFoundException(`Doctor with ID "${id}" not found`);
  //   }

  //   return updatedDoctor;
  // }

  async deleteDoctor(doctorId: string): Promise<void> {
    const doctor = await this.doctorModel.findById(doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Delete the corresponding user
    await this.userModel.findByIdAndDelete(doctor.user);

    // Delete the doctor
    await this.doctorModel.findByIdAndDelete(doctorId);
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
    console.log(data);
    const doctor = await this.doctorModel.findById(data.doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    const timePerSlot = data.timePerSlot;
    const newAvailabilityPromises = data.dates.map((date: string) => {
      const slots = this.generateSlotsForDay(date, timePerSlot, doctor);
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

  //Schedule Management Cancelling Appointments

  async cancelAllSlots(doctorId: string, date: Date): Promise<any> {
    try {
      // Convert date to YYYY-MM-DD format
      const isoDate = date.toISOString().split('T')[0];

      // Find the doctor
      const doctor = await this.doctorModel.findById(doctorId);

      if (!doctor) {
        return { message: 'Doctor not found' };
      }

      // Find the index of the availability entry for the given date
      const availabilityIndex = doctor.availability.findIndex(
        (avail) => avail.date === isoDate,
      );

      if (availabilityIndex === -1) {
        return { message: 'No availability found for the given date' };
      }

      // Remove the availability entry from the array
      doctor.availability.splice(availabilityIndex, 1);
      await doctor.save();

      const appointments = await this.appointmentModel
        .find({
          doctor: doctorId,
          appointmentDate: isoDate,
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: 'email',
          },
        })
        .exec();

      // Send notification emails to all patients with appointments on that date
      for (const appointment of appointments) {
        const patient = await this.patientModel.findById(
          appointment.patient._id,
        );
        if (patient) {
          const user = await this.userModel.findById(patient.user);
          if (user) {
            await this.mailerService.sendMail({
              to: user.email,
              subject: 'Appointment Cancellation Notice!',
              html: `
              <html>
              <body>
                  <h1>Dear, ${patient.name}!</h1>
                  <p>All appointments for ${isoDate} have been cancelled.Please Contact Hospital management team to reschedule an appointmnet </p>
                 
                      </body>
                      </html>
            `,
            });
          }
        }
      }

      return { message: 'All slots canceled successfully and date removed' };
    } catch (error) {
      throw new Error(`Error canceling all slots: ${error.message}`);
    }
  }
  async cancelSlot(cancelSlotDto: CancelSlotDto): Promise<void> {
    const { doctorId, date, slotId } = cancelSlotDto;
    console.log('Cancelling a slot');

    // Convert date to ISO string format for MongoDB query
    const isoDate = new Date(date).toISOString().split('T')[0]; // Use only the date part
    console.log(`Doctor ID: ${doctorId}, Date: ${isoDate}, Slot ID: ${slotId}`);

    // Convert IDs to ObjectId
    const doctorObjectId = new Types.ObjectId(doctorId);
    const slotObjectId = new Types.ObjectId(slotId);

    // Update the slot's status to 'cancelled' in the specified date
    const result = await this.doctorModel.updateOne(
      {
        _id: doctorObjectId, // Doctor ID
        'availability.date': isoDate, // Date in availability
        'availability.slots._id': slotObjectId, // Slot ID
      },
      {
        $set: {
          'availability.$.slots.$[slot].status': 'cancelled', // Set status to 'cancelled'
        },
      },
      {
        arrayFilters: [
          { 'slot._id': slotObjectId }, // Filter for the correct slot
        ],
        multi: true, // Apply to all matching documents
      },
    );

    console.log(`Matched Count: ${result.matchedCount}`);
    console.log(`Modified Count: ${result.modifiedCount}`);

    if (result.matchedCount === 0) {
      throw new NotFoundException('Slot not found');
    }

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Slot status was not updated');
    } else if (result.modifiedCount > 0) {
      // Fetch appointment details with populated patient and user
      const appointment = await this.appointmentModel
        .findOne({
          doctor: doctorObjectId,
          appointmentDate: isoDate,
          slot: slotObjectId,
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: 'email',
          },
        })
        .exec();
      const doctor = await this.doctorModel.findById(cancelSlotDto.doctorId);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      const patient = await this.patientModel.findById(appointment.patient._id);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const user = await this.userModel.findById(patient.user);

      if (user) {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Appointment Cancellation Notice!',
          html: `
          <html>
          <body>
              <h1>Dear, ${patient.name}!</h1>
              <p>Your appointmnet for ${isoDate} with Dr. ${doctor.name} have been cancelled due to some reason .Please Contact Hospital management team to reschedule an appointmnet </p>
             
                  </body>
                  </html>
        `,
        });
      }
    }
  }
}
