import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/schemas/User.schema';
import { Availability } from 'src/schemas/Availability.schema';
import { Slot } from 'src/schemas/Slot.schema';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Slot.name) private slotModel: Model<Slot>,
    @InjectModel(Availability.name)
    private availabilityModel: Model<Availability>,
  ) {}

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

  async addAvailability(data: any): Promise<Doctor> {
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
}
