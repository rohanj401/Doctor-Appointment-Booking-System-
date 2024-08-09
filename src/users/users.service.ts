import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/schemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Doctor } from 'src/schemas/doctor.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateDoctorDto } from 'src/doctors/dtos/create-doctor.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    private readonly cloudinaryService: CloudinaryService,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}
  async getUserByEmail(email) {
    try {
      console.log(email);
      // Ensure the `email` field is correctly defined in your schema
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error; // or handle error as needed
    }
  }

  async createUser(createUserDto: any) {
    const user = new this.userModel(createUserDto);
    const userr = await this.getUserByEmail(user.email);
    const { email, name, password, role, ...otherData } = createUserDto;
    if (!userr) {
      //addedfor email verification
      const payload = { email: user.email[0] };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JwtSecret,
        expiresIn: '1h',
      });
      console.log(`Toke is ${token}`);
      const url = `http://localhost:3000/users/verify-email?token=${token}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        // template: './verify-email', // Path to your email template
        // context: {
        //   url,
        // },
        html: `Hello ,<br>Verify : <p>${url}</p>`,
      });
      //till here
      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password[0], 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();

      // if (role === 'doctor') {
      //   console.log(JSON.stringify(otherData));
      //   await this.httpService
      //     .post('http://localhost:3000/doctors', {
      //       ...otherData,
      //       userId: user._id,
      //     })
      //     .toPromise();
      // }
      if (role === 'doctor') {
        console.log('Saving doctor data');
        await this.saveDoctor({ ...otherData, user: user._id });
      } else if (role === 'patient') {
        await this.httpService
          .post('http://localhost:3000/patients', {
            ...otherData,
            user: user._id,
          })
          .toPromise();
      }
    } else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }

  async saveDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      console.log(createDoctorDto.document);
      console.log(`File Properties : ${Object.keys(createDoctorDto.document)}`);
      let document = await this.cloudinaryService.uploadImage(
        createDoctorDto.document,
      );
      console.log(
        `File Properties : ${Object.keys(createDoctorDto.profilePic)}`,
      );
      let profilePic = await this.cloudinaryService.uploadImage(
        createDoctorDto.profilePic,
      );
      delete createDoctorDto.profilePic;
      delete createDoctorDto.document;
      let doctor = {
        documentUrl: document.secure_url,
        profilePic: profilePic.secure_url,
        ...createDoctorDto,
      };
      const newDoctor = new this.doctorModel(doctor);
      return await newDoctor.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'A doctor with this mobile number or email already exists.',
        );
      }
      throw error;
    }
  }

  // private async saveDoctor(doctorData: CreateDoctorDto) {
  //   // Implement the logic to save doctor-specific data in the database
  //   // For example, assuming you have a Doctor model:
  //   console.log(doctorData.document);
  //   console.log(doctorData.document.buffer);
  //   let document = await this.cloudinaryService.uploadImage(
  //     doctorData.document,
  //   );
  //   let profilePic = await this.cloudinaryService.uploadImage(
  //     doctorData.profilepic,
  //   );
  //   delete doctorData.profilepic;
  //   delete doctorData.document;
  //   let doctorr = {
  //     documentUrl: document.secure_url,
  //     profilePic: profilePic.secure_url,
  //     ...doctorData,
  //   };
  //   const newDoctor = new this.doctorModel(doctorr);
  //   console.log(`newDoctor is ${newDoctor}`);
  //   // const doctor = new this.doctorModel(doctorData);
  //   await newDoctor.save();
  // }

  async verifyEmail(token: string): Promise<void> {
    console.log('Verifying Users Email');
    let payload;
    try {
      // Verify the JWT token
      payload = this.jwtService.verify(token, {
        secret: process.env.JwtSecret,
      });
      console.log(payload);
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.userModel.findOne({ email: payload.email }).exec();

    if (user) {
      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already verified');
      }
      user.isEmailVerified = true;
      await user.save();
      return;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  getUsers() {
    return this.userModel.find();
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Validate the ID format before trying to update
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('Invalid user ID');
    }

    // Perform the update operation
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true, // Ensure the update adheres to the schema
      })
      .exec(); // Ensure to use exec() to handle promises correctly

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    // Validate the ID format
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('Invalid user ID');
    }

    // Perform the delete operation
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }
}
