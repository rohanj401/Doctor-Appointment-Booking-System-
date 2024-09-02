import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePrescriptionDto } from './dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from './dtos/update-prescription.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/Patient.schema';
import { Prescription } from 'src/schemas/Prescription.schema'; // Import the model directly
import { Mode } from 'fs';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Type } from 'class-transformer';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription.name)
    private readonly prescriptionModel: Model<Prescription>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
  ) { }

  private async validateDoctorAndPatient(
    doctorId: string,
    patientId: string,
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(doctorId) ||
      !Types.ObjectId.isValid(patientId)
    ) {
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

  async findByPatientId(pId: string) {
    const patientId = new Types.ObjectId(pId);

    const responce = this.prescriptionModel.find({ patientId }).exec();

    console.log(JSON.stringify(responce));
    return responce;
  }

  async savePrescription(prescriptionDto: {
    patientId: string;
    doctorId: string;
    doctorName: string;
    patientName: string;
    note: string;
    medicines: {
      name: string;
      dosage: string[];
      time: string;
      days: number;
    }[];
    appointmentDate: string;
    slotId: string;
  }): Promise<Prescription> {
    // Transform IDs to ObjectId type
    const transformedPrescriptionDto = {
      ...prescriptionDto,
      doctorId: new Types.ObjectId(prescriptionDto.doctorId),
      patientId: new Types.ObjectId(prescriptionDto.patientId),
      appointmentDate: new Date(prescriptionDto.appointmentDate),
      slotId: new Types.ObjectId(prescriptionDto.slotId),
    };

    // Create a new Prescription document
    const newPrescription = new this.prescriptionModel(
      transformedPrescriptionDto,
    );

    // Save and return the prescription
    const res = newPrescription.save();
    await this.appointmentModel.updateOne(
      { slot: transformedPrescriptionDto.slotId }, // Use slotId field to find the appointment
      { $set: { status: 'completed' } },
    );

    return res;
  }

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
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

  async update(
    id: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    const { doctor, patient } = updatePrescriptionDto;

    if (doctor || patient) {
      await this.validateDoctorAndPatient(doctor, patient);
    }

    const updatedPrescription = await this.prescriptionModel
      .findByIdAndUpdate(id, updatePrescriptionDto, { new: true })
      .exec();
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




  //get prescription where doctor id is equal to doctor id


  // async findPrescriptionByDoctorId(dId: string) {
  //   try {
  //     console.log("This is From Doctor Service id", dId);
  //     const doctorId = new Types.ObjectId(dId);
  //     const responce = await this.prescriptionModel.find({ doctorId }).exec();
  //     console.log("This is From Doctor Service", JSON.stringify(responce));
  //     return responce;
  //   } catch (error) {
  //     throw new Error(`Error finding prescription for Doctor: ${error.message}`);
  //   }
  // }

  // async findPrescriptionByDoctorId(dId: string) {
  //   try {
  //     const doctorId = new Types.ObjectId(dId);
  //     const responce = this.prescriptionModel.find({ doctorId }).exec();
  //     console.log(JSON.stringify(responce));

  //     return responce;
  //   } catch (error) {
  //     throw new Error(`Error finding prescription for Doctor: ${error.message}`);
  //   }
  // }

  // async findPrescriptionByDoctorId(dId: string) {
  //   try {
  //     const doctorId = new Types.ObjectId(dId);
  //     const response = await this.prescriptionModel
  //       .find({ doctorId })
  //       .select("patientId doctorId prescriptionId patientName") // Project only patientId, doctorId, and prescriptionId
  //       .exec();

  //     console.log(JSON.stringify(response));
  //     return response;
  //   } catch (error) {
  //     throw new Error(`Error finding prescription for Doctor: ${error.message}`);
  //   }
  // }

  async findPrescriptionByDoctorId(dId: string) {
    try {
      const doctorId = new Types.ObjectId(dId);
      const response = await this.prescriptionModel.aggregate([
        { $match: { doctorId } },
        {
          $group: {
            _id: "$patientId",
            doctorId: { $first: "$doctorId" },
            prescriptionId: { $first: "$_id" }, // Assuming _id is the prescriptionId
            patientId: { $first: "$patientId" },
            patientName: { $first: "$patientName" }, // Add other fields as needed

          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field created by $group
            patientId: 1,
            prescriptionId: 1,
            patientName: 1,
          },
        },
      ]);

      console.log(JSON.stringify(response));
      return response;
    } catch (error) {
      throw new Error(`Error finding prescription for Doctor: ${error.message}`);
    }
  }




}

