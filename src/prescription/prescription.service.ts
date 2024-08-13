// prescription.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Prescription } from 'src/schemas/Prescription.schema';
import { CreatePrescriptionDto } from './dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from './dtos/update-prescription.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/Patient.schema';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription.name) private readonly prescriptionModel: Model<Prescription>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>, 
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>, 
  ) {}

  private async validateDoctorAndPatient(doctorId: string, patientId: string): Promise<void> {
    if (!Types.ObjectId.isValid(doctorId) || !Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid doctor or patient ID format.');
    }

    const doctorExists = await this.doctorModel.exists({ _id: doctorId });
    if (!doctorExists) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found.`);
    }

    const patientExists = await this.patientModel.exists({ _id: patientId });
    if (!patientExists) {
      throw new NotFoundException(`Patient with ID ${patientId} not found.`);
    }
  }

  async create(createPrescriptionDto: CreatePrescriptionDto): Promise<Prescription> {
    const { doctor, patient } = createPrescriptionDto;

    await this.validateDoctorAndPatient(doctor, patient);

    const newPrescription = new this.prescriptionModel(createPrescriptionDto);
    return newPrescription.save();
  }

  async findAll(query: any): Promise<Prescription[]> {
    const filter: any = {};
  
    // Filter by doctor
    if (query.doctor) {
      filter.doctor = query.doctor;
    }
  
    // Filter by patient
    if (query.patient) {
      filter.patient = query.patient;
    }
  
    // Filter by updateReason
    if (query.updateReason) {
      filter.updateReason = { $regex: query.updateReason, $options: 'i' }; // Case-insensitive search
    }
  
    // Limit the number of results
    const limit = query.limit ? parseInt(query.limit, 10) : 10; // Default limit of 10
  
    // Execute the query with filters and limit
    return this.prescriptionModel.find(filter).limit(limit).exec();
  }
    async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel.findById(id).exec();
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found.`);
    }
    return prescription;
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto): Promise<Prescription> {
    const { doctor, patient } = updatePrescriptionDto;

    if (doctor || patient) {
      await this.validateDoctorAndPatient(doctor, patient);
    }

    const updatedPrescription = await this.prescriptionModel.findByIdAndUpdate(
      id,
      updatePrescriptionDto,
      { new: true },
    ).exec();
    if (!updatedPrescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found.`);
    }
    return updatedPrescription;
  }

  async remove(id: string): Promise<Prescription> {
    const result = await this.prescriptionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Prescription with ID ${id} not found.`);
    }
    return result;
  }
}
