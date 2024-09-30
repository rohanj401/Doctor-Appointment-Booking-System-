import { Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctor.schema';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/schemas/Admin.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { DoctorsService } from 'src/doctors/doctors.service';
import { UsersService } from 'src/users/users.service';
import { generateDoctorVerifiedEmail } from '../EmailTemplates/verifiedEmailTemplate';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly mailerService: MailerService,
    private readonly doctorsService: DoctorsService,
    private readonly usersService: UsersService,
  ) {}

  async getAdmins(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async verifyDoctor(id: string): Promise<Doctor> {
    const doctor = await this.doctorsService.getDoctorById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    doctor.isVerified = true;
    await doctor.save();
    this.sendVerifiedMail(doctor);
    return doctor;
  }

  async sendVerifiedMail(doctor: Doctor) {
    const user = await this.usersService.getUserById(doctor.user.toString());
    const emailContent = generateDoctorVerifiedEmail(user.name);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Profile Verification Complete',
      html: emailContent,
    });
  }
}
