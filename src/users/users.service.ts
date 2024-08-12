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
import { CreatePatientDto } from 'src/patients/dtos/create-patient.dto';
import { Patient } from 'src/schemas/Patient.schema';
import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private patientModel: Model<Doctor>,
    private readonly cloudinaryService: CloudinaryService,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) { }
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

  async createUserDoctor(createUserDto: CreateUserDoctorDto) {
    console.log(typeof (createUserDto.profilePic));
    console.log(createUserDto.profilePic);
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

        console.log('Saving doctor data');
        await this.saveDoctor({ ...otherData, user: user._id ,name:user.name});
    }
      else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }


  // async createUserPatient(createUserPatientDto: CreateUserDoctorDto) {
  //   console.log(typeof (createUserPatientDto.profilePic));
  //   console.log(createUserPatientDto.profilePic);
  //   const user = new this.userModel(createUserPatientDto);
  //   const userr = await this.getUserByEmail(user.email);
  //   const { email, name, password, role, ...otherData } = createUserPatientDto;
  //   if (!userr) {
  //     //addedfor email verification
  //     const payload = { email: user.email[0] };
  //     const token = this.jwtService.sign(payload, {
  //       secret: process.env.JwtSecret,
  //       expiresIn: '1h',
  //     });
  //     console.log(`Toke is ${token}`);
  //     const url = `http://localhost:3000/users/verify-email?token=${token}`;
  //     await this.mailerService.sendMail({
  //       to: email,
  //       subject: 'Email Verification',
  //       // template: './verify-email', // Path to your email template
  //       // context: {
  //       //   url,
  //       // },
  //       html: `Hello ,<br>Verify : <p>${url}</p>`,
  //     });
  //     //till here
  //     console.log(`Hashing Paswword `);
  //     const password = await bcrypt.hash(user.password[0], 10);
  //     console.log('Paswword Hashed ');

  //     user.password = password;
  //     await user.save();


  //     if (role === 'doctor') {
  //       console.log('Saving doctor data');
  //       await this.saveDoctor({ ...otherData, user: user._id });
  //     } else if (role === 'patient') {
  //       console.log('Saving patient data');
  //       await this.savePatient({ ...otherData, user: user._id });
  //     }
  //   } else {
  //     throw new BadRequestException('User with this email-Id Allready Exist ');
  //   }
  // }



  async saveDoctor(createDoctorDto: any): Promise<Doctor> {
    try {
      // Extract clinic details from createDoctorDto
      const clinicDetails = {
        clinicName: createDoctorDto.clinicName,
        clinicAddress: createDoctorDto.clinicAddress,
        city: createDoctorDto.city,
        state: createDoctorDto.state,
        eveningEndTime: createDoctorDto.eveningEndTime,
        eveningStartTime: createDoctorDto.eveningStartTime,
        morningEndTime: createDoctorDto.morningEndTime,
        morningStartTime: createDoctorDto.morningStartTime,
        coordinates:createDoctorDto.coordinates,
      };
  
      // Create a new doctor object with separated clinicDetails
      const newDoctor = await new this.doctorModel({
        ...createDoctorDto,
        clinicDetails, // Assign the extracted clinic details to the doctor object
      });
  
      console.log(newDoctor);
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
  

  
  //  async savePatient(creatPatientDto: any): Promise<Patient> {
  //   try {
  //     console.log(creatPatientDto.profilePic);
     
  //     const newPatient = new this.patientModel(creatPatientDto);
  //     return await newPatient.save();
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       throw new ConflictException(
  //         'A doctor with this mobile number or email already exists.',
  //       );
  //     }
  //     throw error;
  //   }
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
