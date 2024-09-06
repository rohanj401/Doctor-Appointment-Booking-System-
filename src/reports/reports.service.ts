// reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reports } from 'src/schemas/Reports.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { Patient } from 'src/schemas/Patient.schema';
import { Doctor } from 'src/schemas/doctor.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Reports.name) private reportModel: Model<Reports>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async createReport(createReportDto: CreateReportDto): Promise<Reports> {
    const patientt = await this.patientModel
      .findById(createReportDto.patient)
      .exec();

    if (!patientt) {
      throw new NotFoundException('Patient not found.');
    }
    if (createReportDto.doctor) {
      const doctorId = new Types.ObjectId(createReportDto.doctor);
      const doctorData = await this.doctorModel.findById(doctorId).exec();

      if (!doctorData) {
        throw new NotFoundException('Doctor not found.');
      }
      if (doctorData._id) {
        createReportDto.doctor = doctorId;
      }
    }
    createReportDto.patient = patientt._id;
    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }
  async getReports(query: any = {}): Promise<Reports[]> {
    if (query.patient) {
      query.patient = new Types.ObjectId(query.patient);
    }
    if (query.doctor) {
      query.doctor = new Types.ObjectId(query.doctor);
    }
    return this.reportModel
      .find(query)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .exec();
  }
  async deleteReport(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }
}
