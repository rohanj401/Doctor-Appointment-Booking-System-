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

@Injectable()
export class DoctorsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(User.name) private userModel: Model<User>, 

  ) {}

  // async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
  //   try {
  //     console.log(createDoctorDto);
  //     let document = await this.cloudinaryService.uploadImage(
  //       createDoctorDto.document,
  //     );
  //     let profilePic = await this.cloudinaryService.uploadImage(
  //       createDoctorDto.profilePic,
  //     );
  //     delete createDoctorDto.profilePic;
  //     delete createDoctorDto.document;
  //     let doctor = {
  //       documentUrl: document.secure_url,
  //       profilePic: profilePic.secure_url,
  //       ...createDoctorDto,
  //     };
  //     const newDoctor = new this.doctorModel(doctor);
  //     return await newDoctor.save();
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       // Duplicate key error
  //       throw new ConflictException(
  //         'A doctor with this mobile number or email already exists.',
  //       );
  //     }
  //     throw error;
  //   }
  // }

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
  
}
