import { Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctor.schema';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/schemas/Admin.schema';

@Injectable()
export class AdminService {

    constructor(

        @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Admin.name) private adminModel: Model<Admin>,

    ) { }

    async getAdmins(): Promise<Admin[]> {
        return this.adminModel.find().exec();
    }

    async fetchAdminByUserId(userId: string) {
        console.log('getting patient by userId');
        const patient = await this.adminModel
            .findOne({ user: new mongoose.Types.ObjectId(userId) })
            .exec();

        if (!patient) {
            throw new NotFoundException(`Admin with user ID ${userId} not found`);
        }
        return Admin;
    }



}
