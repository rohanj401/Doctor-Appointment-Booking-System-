import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/schemas/User.schema';
import mongoose, { Model, Types } from 'mongoose';
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
import { CreateUserPatientDto } from './dtos/create-user-patient.dto';
import { Coordinates } from 'src/doctors/dtos/coordinates';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
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
    console.log(typeof createUserDto.profilePic);
    console.log(createUserDto.profilePic);
    const user = new this.userModel(createUserDto);
    const userr = await this.getUserByEmail(user.email);
    const { email, password, role, ...otherData } = createUserDto;
    if (!userr) {
      //addedfor email verification
      const payload = { email: user.email };
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
        html: `Hello ,<br>Please Visit Below Link to Verify : <p>${url}</p>`,
      });
      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password, 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();

      console.log('Saving doctor data');
      await this.saveDoctor({ ...otherData, user: user._id, email: user.email });
    } else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }

  async createUserPatient(createUserPatientDto: CreateUserPatientDto) {
    // console.log(typeof (createUserPatientDto.profilePic));
    // console.log(createUserPatientDto.profilePic);
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
      console.log(`Toke is ${token}`);
      const url = `http://localhost:3000/users/verify-email?token=${token}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        // template: './verify-email', // Path to your email template
        // context: {
        //   url,
        // },
        html: `Hello ,<br>Verify your mail by visiting below link : <p>${url}</p>`,
      });
      //till here
      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password, 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();


      await this.savePatient({ ...otherData, user: user._id, email: user.email });

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
      const newDoctor = await new this.doctorModel({
        ...createDoctorDto,
        clinicDetails, // Assign the extracted clinic details to the doctor object
        location,
      });

      console.log(newDoctor);
      await newDoctor.save();

      //send mail-----------------------------------------------------------

      const { email, name, speciality, contactNumber, profilePic } = createDoctorDto;
      console.log(email, name, speciality, contactNumber, profilePic);

      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `
<html>
<body>
    <h1>Welcome to Our Platform, Dr. ${name}!</h1>
    <p>We are excited to have you on board as one of our esteemed doctors.</p>
    <p>Thank you for registering. Your profile has been successfully created.</p>
    <p>Here are some details about your registration:</p>
    <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Specialty:</strong> ${speciality}</li>
        <li><strong>Contact Number:</strong> ${contactNumber}</li>
    </ul>
    <p>Once your details are verified by our admin, you will be added to the list of doctors available to patients. 
    You will receive a notification email once your verification is complete.</p>
    
    <p>You can check your profile or update your details <a href="${profilePic}">here</a>.</p>
    
    <p>If you have any questions, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    <p>Best regards,<br>The Platform Team</p>
</body>
</html>
            `,
      });

      return newDoctor;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          // 'A doctor with this mobile number or email already exists.',
          console.log(error),
        );
      }
      throw error;
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
      const newPatient = new this.patientModel({
        ...createPatientDto,
        address,
      });

      //saving patient
      await newPatient.save();


      //sending mail---------------------------

      const { email, name, contactNumber, profilePic } = createPatientDto;

      console.log(email, name, contactNumber, profilePic);

      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `
      <html>
      <body>
          <h1>Welcome to Our Platform, ${name}!</h1>
          <p>Thank you for registering. Your account has been successfully created.</p>
          <p>Here are some details about your registration:</p>
          <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Contact Number:</strong> ${contactNumber}</li>
                  </ul>
                  <p>You can now browse and book appointments with our doctors.</p>

                  <p>You can check your profile or update your details <a href="${profilePic}">here</a>.</p>
                  
                  <p>If you have any questions, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
                  <p>Best regards,<br>The Platform Team</p>
              </body>
              </html>
    `,
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

    // Check if the user is a doctor
    if (user.role === 'doctor') {
      await this.doctorModel.findOneAndDelete({
        user: new Types.ObjectId(userId),
      });
    }

    if (user.role === 'patient') {
      await this.patientModel.findOneAndDelete({
        user: new Types.ObjectId(userId),
      });
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

      console.log(`Hashing Paswword `);
      const password = await bcrypt.hash(user.password, 10);
      console.log('Paswword Hashed ');

      user.password = password;
      await user.save();
      return user;
    } else {
      throw new BadRequestException('Admin with this email-Id Allready Exist ');
    }
  }

}
