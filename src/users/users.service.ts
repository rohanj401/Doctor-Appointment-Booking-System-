import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../schemas/User.schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Doctor } from '../schemas/doctor.schema';
import { Patient } from '../schemas/Patient.schema';
import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto';
import { CreateUserPatientDto } from './dtos/create-user-patient.dto';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto';
import { generateDoctorWelcomeEmail } from '../EmailTemplates/welcomeDoctorEmailTemplate';
import { generatePatientWelcomeEmail } from '../EmailTemplates/welcomePateintEmailTemplate';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService,
    private readonly doctorService: DoctorsService,
  ) {}
  async getUserByEmail(email: string) {
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
    console.log(typeof createUserDto.profilePic);
    console.log(createUserDto.profilePic);
    const user = new this.userModel(createUserDto);
    const userr = await this.getUserByEmail(user.email);
    const { email, password, role, ...otherData } = createUserDto;
    if (!userr) {
      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password, 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();

      console.log('Saving doctor data');
      await this.saveDoctor({
        ...otherData,
        user: user._id,
        email: user.email,
      });
    } else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }

  async createUserPatient(createUserPatientDto: CreateUserPatientDto) {
    const user = new this.userModel(createUserPatientDto);
    const userr = await this.getUserByEmail(user.email);
    const { email, password, role, ...otherData } = createUserPatientDto;
    if (!userr) {
      //addedfor email verification
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JwtSecret,
        expiresIn: '1h',
      });

      //till here
      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password, 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();

      await this.savePatient({
        ...otherData,
        user: user._id,
        email: user.email,
      });
    } else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }

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
        slotDuration: createDoctorDto.slotDuration,
      };
      const location = {
        type: 'Point',
        coordinates: [
          createDoctorDto.coordinates.latitude,
          createDoctorDto.coordinates.longitude,
        ],
      };
      // Create a new doctor object with separated clinicDetails

      const doctor = { ...createDoctorDto, clinicDetails, location };
      const newDoctor = await this.doctorService.createDcotor(doctor);
      console.log(newDoctor);
      await newDoctor.save();

      //send mail-----------------------------------------------------------

      const { email, name, speciality, contactNumber, profilePic } =
        createDoctorDto;
      console.log(email, name, speciality, contactNumber, profilePic);
      const emailContent = generateDoctorWelcomeEmail(
        name,
        speciality,
        contactNumber,
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our Platform!',
        html: emailContent,
      });

      return newDoctor;
    } catch (error) {
      if (error.code === 11000) {
        console.log(error); // Log the error for debugging purposes
        throw new ConflictException(
          'A doctor with this mobile number or email already exists.',
        );
      }
      throw error; // Rethrow other errors
    }
  }

  async savePatient(createPatientDto: any): Promise<Patient> {
    try {
      const address = {
        address: createPatientDto.address,
        city: createPatientDto.city,
        pinCode: createPatientDto.pinCode,
        state: createPatientDto.state,
      };

      const createPatient = { ...createPatientDto, address };
      const newPatient = this.patientService.createPatient(createPatient);
      const { email, name, contactNumber, profilePic } = createPatientDto;

      console.log(email, name, contactNumber, profilePic);
      const emailContent = generatePatientWelcomeEmail(
        name,
        email,
        contactNumber,
      );
      this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our Platform!',
        html: emailContent,
      });

      return newPatient;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'A doctor with this mobile number or email already exists.',
        );
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    console.log('Verifying Users Email');
    let payload;
    try {
      // Verify the JWT token
      payload = this.jwtService.verify(token, {
        secret: process.env.JwtSecret,
      });
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
        runValidators: true,
      })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // // Check if the user is a doctor
    if (user.role === 'doctor') {
      await this.doctorService.deleteDoctorByUserId(userId);
    }

    if (user.role === 'patient') {
      await this.patientService.deletePatientByUserId(userId);
    }
    // Delete the user
    await this.userModel.findByIdAndDelete(userId);
  }

  //admin Creation------------------------------------------
  async createUserAdmin(createUserDto: CreateUserAdminDto) {
    const user = new this.userModel(createUserDto);
    const userr = await this.getUserByEmail(user.email);
    const { email, name, password, role, ...otherData } = createUserDto;
    if (!userr) {
      const password = await bcrypt.hash(user.password, 10);

      user.password = password;
      await user.save();
      return user;
    } else {
      throw new BadRequestException('Admin with this email-Id Allready Exist ');
    }
  }
}
