import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Patient } from '../schemas/Patient.schema';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { User } from '../schemas/User.schema';
import { Prescription } from 'src/schemas/Prescription.schema';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Doctor } from 'src/schemas/doctor.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<Prescription>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
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

  async fetchPatientByUserId(userId: string) {
    console.log('getting patient by userId');
    const patient = await this.patientModel
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .exec();

    if (!patient) {
      throw new NotFoundException(`Patient with user ID ${userId} not found`);
    }

    return patient;
  }

  // async deletePatient(patientId: string): Promise<void> {
  //   const patient = await this.patientModel.findById(patientId);

  //   if (!patient) {
  //     throw new NotFoundException('Patient not found');
  //   }

  //   console.log('Deleting patient with ID:', patientId);
  //   await this.appointmentModel.deleteMany({ patient: patientId });

  //   await this.prescriptionModel.deleteMany({ patientId: patientId });
  //   await this.patientModel.findByIdAndDelete(patientId);

  //   // Delete the corresponding user
  //   await this.userModel.findByIdAndDelete(patient.user);

  //   // Delete the patient

  // }

  async deletePatient(patientId: string): Promise<void> {
    const patient = await this.patientModel.findById(patientId);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const patientIdObject = new mongoose.Types.ObjectId(patientId);
    const appointments = await this.appointmentModel.find({
      patient: patientIdObject,
      status: 'accepted',
    });

    if (appointments.length > 0) {
      for (const appointment of appointments) {
        const { doctor, slot } = appointment; // Assuming `doctor` and `slot` are stored in the appointment model

        const doctorObjectId = new mongoose.Types.ObjectId(doctor);
        const slotObjectId = new mongoose.Types.ObjectId(slot);

        // Update the slot status to 'available' in the doctor's availability
        const isoDate = appointment.appointmentDate.toISOString().split('T')[0]; // Extract ISO date from appointmentDate
        console.log('Date is ', isoDate);
        await this.doctorModel.updateOne(
          {
            _id: doctorObjectId,
            'availability.date': isoDate, // Match the correct date
            'availability.slots._id': slotObjectId, // Match the correct slot
          },
          {
            $set: {
              'availability.$.slots.$[slot].status': 'available', // Set the slot status to 'available'
            },
          },
          {
            arrayFilters: [{ 'slot._id': slotObjectId }],
            multi: true, // Ensure multi-slot updates if required
          },
        );
      }
    }
    // Delete appointments associated with the patient
    await this.appointmentModel.deleteMany({ patient: patientIdObject });

    // Delete prescriptions associated with the patient
    await this.prescriptionModel.deleteMany({ patientId: patientIdObject });

    // Delete the patient
    await this.patientModel.findByIdAndDelete(patientId);

    // Delete the corresponding user
    await this.userModel.findByIdAndDelete(patient.user);
  }
}
