import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { Doctor } from 'src/schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      const newDoctor = new this.doctorModel(createDoctorDto);
      return await newDoctor.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('A doctor with this mobile number or email already exists.');
      }
      throw error;
    }
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

  async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }
    return updatedDoctor;
  }

  async deleteDoctor(id: string): Promise<{ message: string }> {
    const result = await this.doctorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Doctor with ID "${id}" not found`);
    }
    return { message: `Doctor with ID "${id}" deleted successfully` };
  }
}
