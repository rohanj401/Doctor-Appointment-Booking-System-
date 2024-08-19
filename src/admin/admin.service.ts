import { Injectable } from '@nestjs/common';
import { Doctor } from 'src/schemas/doctor.schema';
import { User } from 'src/schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

}
