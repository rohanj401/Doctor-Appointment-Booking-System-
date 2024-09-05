import { Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctor.schema';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/schemas/Admin.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userName: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async getAdmins(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  // async fetchAdminByUserId(userId: string) {
  //     console.log('getting patient by userId');
  //     const patient = await this.adminModel
  //         .findOne({ user: new mongoose.Types.ObjectId(userId) })
  //         .exec();

  //     if (!patient) {
  //         throw new NotFoundException(`Admin with user ID ${userId} not found`);
  //     }
  //     return Admin;
  // }

  async verifyDoctor(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    doctor.isVerified = true;
    await doctor.save();
    this.sendVerifiedMail(doctor);
    return doctor;
  }

  async sendVerifiedMail(doctor: Doctor) {
    const user = await this.userModel.findById(doctor.user);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Profile Verification Complete',
      html: `
        <html>
        <body>
          <h1>Dear Dr. ${user.name},</h1>
          <p>
            We are pleased to inform you that your profile has been successfully verified. You can now fully access your account, manage your profile, and start scheduling appointments with patients. 
          </p>
          <p>
            Thank you for your patience and for choosing our platform. If you have any questions or need further assistance, please do not hesitate to contact us.
          </p>
          <p>
            Best regards,<br/>
            The DABS Team
          </p>
        </body>
        </html>
      `,
    });
  }
}
