import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';

@Injectable()
export class DoctorsService {
  updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto) {
    throw new Error('Method not implemented.');
  }
  getDoctorById(id: string) {
    throw new Error('Method not implemented.');
  }
  getDoctors() {
    throw new Error('Method not implemented.');
  }
  createDoctor(createDoctorDto: CreateDoctorDto) {
    throw new Error('Method not implemented.');
  }
}
