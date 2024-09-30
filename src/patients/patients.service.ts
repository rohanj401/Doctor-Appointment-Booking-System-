import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Patient } from '../schemas/Patient.schema';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';

import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PrescriptionService))
    private readonly prescriptionService: PrescriptionService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly apppointmentsService: AppointmentsService,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorsService: DoctorsService,
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
  async deletePatientByUserId(userId) {
    await this.patientModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  }
  async deletePatient(patientId: string): Promise<void> {
    const patient = await this.patientModel.findById(patientId);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const patientIdObject = new mongoose.Types.ObjectId(patientId);

    const appointments =
      await this.apppointmentsService.findAppointmentsByPatientIdAndStatus(
        patientId,
        'accepted',
      );
    if (appointments.length > 0) {
      for (const appointment of appointments) {
        const { doctor, slot } = appointment; // Assuming `doctor` and `slot` are stored in the appointment model

        const doctorObjectId = new mongoose.Types.ObjectId(doctor);
        const slotObjectId = new mongoose.Types.ObjectId(slot);

        // Update the slot status to 'available' in the doctor's availability
        const isoDate = appointment.appointmentDate.toISOString().split('T')[0]; // Extract ISO date from appointmentDate
        console.log('Date is ', isoDate);

        await this.doctorsService.updateSlotStatusWhileDeletePatient(
          doctorObjectId,
          isoDate,
          slotObjectId,
        );
      }
    }

    // Delete appointments associated with the patient
    await this.apppointmentsService.deleteAppointmentsByPatientId(patientId);
    // Delete prescriptions associated with the patient
    await this.prescriptionService.deletePrescriptionsByPatientId(
      patientIdObject,
    );
    // Delete the patient
    await this.patientModel.findByIdAndDelete(patientId);

    // Delete the corresponding user
    await this.userService.deleteUserById(patient.user.toString());
  }

  async checkIfPatientExists(patientId: string) {
    const res = await this.patientModel.exists({ _id: patientId });
    return res;
  }
}
