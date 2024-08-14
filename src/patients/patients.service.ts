import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from 'src/schemas/Patient.schema';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  createPatient(createPatientDto: CreatePatientDto) {
    const newPatient = new this.patientModel(createPatientDto);
    return newPatient.save();
  }

  getPatients() {
    return this.patientModel.find();
  }

  async getPatientById(id: string) {
    return await this.patientModel.findById(id);
  }

  async updateUser(id: string, updatePatientDto: UpdatePatientDto) {
    return await this.patientModel.findByIdAndUpdate(id, updatePatientDto, {
      new: true,
    });
  }

  async deletePatient(patientId: string): Promise<void> {
    const patient = await this.patientModel.findById(patientId);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Delete the corresponding user
    await this.userModel.findByIdAndDelete(patient.user);

    // Delete the patient
    await this.patientModel.findByIdAndDelete(patientId);
  }
}
