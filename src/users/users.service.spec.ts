import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { User } from '../schemas/User.schema';
// import { Doctor } from '../schemas/doctor.schema';
// import { Patient } from '../schemas/Patient.schema';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { JwtService } from '@nestjs/jwt';
// import { MailerService } from '@nestjs-modules/mailer';
// import { HttpService } from '@nestjs/axios';
// import { getModelToken } from '@nestjs/mongoose';
// import * as bcrypt from 'bcrypt';
// import { BadRequestException } from '@nestjs/common';
// import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto';
// import { CreateUserPatientDto } from './dtos/create-user-patient.dto';
// import { Model } from 'mongoose';

// describe('UsersService', () => {
//   let service: UsersService;
//   let userModel: Model<User>;
//   let doctorModel: Model<Doctor>;
//   let patientModel: Model<Patient>;
//   let cloudinaryService: CloudinaryService;
//   let jwtService: JwtService;
//   let mailerService: MailerService;
//   let httpService: HttpService;

//   // Mocking Mongoose Models
//   const mockUserModel = {
//     findOne: jest.fn(),
//     create: jest.fn(),
//     save: jest.fn().mockResolvedValue(true), // Mock save method
//   };

//   const mockDoctorModel = {
//     create: jest.fn(),
//     findOneAndDelete: jest.fn(),
//     save: jest.fn().mockResolvedValue(true),
//   };

//   const mockPatientModel = {
//     create: jest.fn(),
//     save: jest.fn().mockResolvedValue(true),
//   };

//   const mockCloudinaryService = {};

//   const mockJwtService = {
//     sign: jest.fn(),
//     verify: jest.fn(),
//   };

//   const mockMailerService = {
//     sendMail: jest.fn(),
//   };

//   const mockHttpService = {};

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         { provide: getModelToken(User.name), useValue: mockUserModel },
//         { provide: getModelToken(Doctor.name), useValue: mockDoctorModel },
//         { provide: getModelToken(Patient.name), useValue: mockPatientModel },
//         { provide: CloudinaryService, useValue: mockCloudinaryService },
//         { provide: JwtService, useValue: mockJwtService },
//         { provide: MailerService, useValue: mockMailerService },
//         { provide: HttpService, useValue: mockHttpService },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     userModel = module.get(getModelToken(User.name));
//     doctorModel = module.get(getModelToken(Doctor.name));
//     patientModel = module.get(getModelToken(Patient.name));
//     cloudinaryService = module.get(CloudinaryService);
//     jwtService = module.get(JwtService);
//     mailerService = module.get(MailerService);
//     httpService = module.get(HttpService);
//   });

//   describe('createUserDoctor', () => {
//     it('should create a new doctor', async () => {
//       const createUserDoctorDto: CreateUserDoctorDto = {
//         email: 'doctor@example.com',
//         password: 'securePassword123',
//         name: 'Dr. John Doe',
//         role: 'doctor',
//         isEmailVerified: false,
//         speciality: 'Orthopedics',
//         qualification: 'MS in Orthopedic Surgery',
//         contactNumber: '+919876543210',
//         registrationNumber: 'ABC123',
//         yearOfRegistration: '2010',
//         stateMedicalCouncil: 'State Medical Council',
//         clinicName: 'Healthy Bones Clinic',
//         pinCode: 123456,
//         state: 'State Name',
//         city: 'City Name',
//         slotDuration: 30,
//         gender: 'male',
//         morningStartTime: '09:00',
//         morningEndTime: '12:00',
//         eveningStartTime: '16:00',
//         eveningEndTime: '19:00',
//       };

//       jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
//       jest.spyOn(userModel, 'create').mockResolvedValue({
//         ...createUserDoctorDto,
//         password: 'hashedPassword',
//       } as any);
//       jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

//       await service.createUserDoctor(createUserDoctorDto);

//       expect(userModel.findOne).toHaveBeenCalledWith({
//         email: createUserDoctorDto.email,
//       });
//       expect(bcrypt.hash).toHaveBeenCalledWith(
//         createUserDoctorDto.password,
//         10,
//       );
//       expect(userModel.create).toHaveBeenCalledWith({
//         ...createUserDoctorDto,
//         password: 'hashedPassword',
//       });
//     });

//     it('should throw BadRequestException if user already exists', async () => {
//       const createUserDoctorDto: CreateUserDoctorDto = {
//         email: 'doctor@example.com',
//         password: 'securePassword123',
//         name: 'Dr. John Doe',
//         role: 'doctor',
//         isEmailVerified: false,
//         speciality: 'Orthopedics',
//         qualification: 'MS in Orthopedic Surgery',
//         contactNumber: '+919876543210',
//         registrationNumber: 'ABC123',
//         yearOfRegistration: '2010',
//         stateMedicalCouncil: 'State Medical Council',
//         clinicName: 'Healthy Bones Clinic',
//         pinCode: 123456,
//         state: 'State Name',
//         city: 'City Name',
//         slotDuration: 30,
//         gender: 'male',
//         morningStartTime: '09:00',
//         morningEndTime: '12:00',
//         eveningStartTime: '16:00',
//         eveningEndTime: '19:00',
//       };

//       jest.spyOn(userModel, 'findOne').mockResolvedValue({
//         email: createUserDoctorDto.email,
//       } as any);

//       await expect(
//         service.createUserDoctor(createUserDoctorDto),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('createUserPatient', () => {
//     it('should create a new patient', async () => {
//       const createUserPatientDto: CreateUserPatientDto = {
//         email: 'patient@example.com',
//         password: 'patientPassword123',
//         name: 'John Smith',
//         role: 'patient',
//         isEmailVerified: false,
//         address: '123 Street Name',
//         state: 'State Name',
//         city: 'City Name',
//         pinCode: 987654,
//         bloodGroup: 'O+',
//         gender: 'male',
//         contactNumber: '+919876543210',
//         profilePic: '/images/avatar.png',
//       };

//       jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
//       jest.spyOn(userModel, 'create').mockResolvedValue({
//         ...createUserPatientDto,
//         password: 'hashedPassword',
//       } as any);
//       jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
//       jest.spyOn(mailerService, 'sendMail').mockResolvedValue({} as any);

//       await service.createUserPatient(createUserPatientDto);

//       expect(userModel.findOne).toHaveBeenCalledWith({
//         email: createUserPatientDto.email,
//       });
//       expect(bcrypt.hash).toHaveBeenCalledWith(
//         createUserPatientDto.password,
//         10,
//       );
//       expect(userModel.create).toHaveBeenCalledWith({
//         ...createUserPatientDto,
//         password: 'hashedPassword',
//       });
//       expect(mailerService.sendMail).toHaveBeenCalled();
//     });

//     it('should throw BadRequestException if user already exists', async () => {
//       const createUserPatientDto: CreateUserPatientDto = {
//         email: 'patient@example.com',
//         password: 'patientPassword123',
//         name: 'John Smith',
//         role: 'patient',
//         isEmailVerified: false,
//         address: '123 Street Name',
//         state: 'State Name',
//         city: 'City Name',
//         pinCode: 987654,
//         bloodGroup: 'O+',
//         gender: 'male',
//         contactNumber: '+919876543210',
//         profilePic: '/images/avatar.png',
//       };

//       jest.spyOn(userModel, 'findOne').mockResolvedValue({
//         email: createUserPatientDto.email,
//       } as any);

//       await expect(
//         service.createUserPatient(createUserPatientDto),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });
// });
