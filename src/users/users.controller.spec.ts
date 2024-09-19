// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';

// describe('UsersController', () => {
//   let controller: UsersController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto'; // Import the DTO
import { CreateUserPatientDto } from './dtos/create-user-patient.dto'; // Import the DTO

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUserDoctor: jest.fn(),
    createUserPatient: jest.fn(),
    getUsers: jest.fn(),
    getUserByEmail: jest.fn(),
    verifyEmail: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUserById: jest.fn(),
    createUserAdmin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUserDoctor', () => {
    it('should call createUserDoctor on the service', async () => {
      const dto: CreateUserDoctorDto = {
        email: 'doctor@example.com',
        password: 'securePassword123',
        name: 'Dr. John Doe',
        role: 'doctor',
        isEmailVerified: false,
        speciality: 'Orthopedics',
        qualification: 'MS in Orthopedic Surgery',
        contactNumber: '+919876543210',
        registrationNumber: 'ABC123',
        yearOfRegistration: '2010',
        stateMedicalCouncil: 'State Medical Council',
        clinicName: 'Healthy Bones Clinic',
        pinCode: 123456,
        state: 'State Name',
        city: 'City Name',
        slotDuration: 30,
        gender: 'male',
        morningStartTime: '09:00', // Add missing time fields
        morningEndTime: '12:00', // Add missing time fields
        eveningStartTime: '16:00', // Add missing time fields
        eveningEndTime: '19:00', // Add missing time fields
      };

      await controller.createUserDoctor(dto);
      expect(service.createUserDoctor).toHaveBeenCalledWith(dto);
    });
  });

  describe('createUserPatient', () => {
    it('should call createUserPatient on the service', async () => {
      const dto: CreateUserPatientDto = {
        email: 'patient@example.com',
        password: 'patientPassword123',
        name: 'John Smith',
        role: 'patient',
        isEmailVerified: false,
        address: '123 Street Name',
        state: 'State Name',
        city: 'City Name',
        pinCode: 987654,
        bloodGroup: 'O+',
        gender: 'male',
        contactNumber: '+919876543210',
        profilePic: '/images/avatar.png',
      };

      await controller.createUserPatient(dto);
      expect(service.createUserPatient).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUsers', () => {
    it('should call getUsers on the service', async () => {
      await controller.getUsers();
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should call getUserByEmail on the service', async () => {
      const email = 'test@example.com';
      await controller.getUserByEmail(email);
      expect(service.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('getUserById', () => {
    it('should return user for valid ID', async () => {
      const userId = '60e4f9d1b2f09b0024cbe9d2';
      const mockUser = { _id: userId, name: 'John Doe' };

      // Cast service.getUserById to a Jest mock function
      (service.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const user = await controller.getUserById(userId);
      expect(user).toEqual(mockUser);
    });

    it('should throw HttpException for invalid user ID', async () => {
      const invalidId = 'invalid_id';

      try {
        await controller.getUserById(invalidId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('updateUser', () => {
    it('should update user for valid ID', async () => {
      const userId = '60e4f9d1b2f09b0024cbe9d2';
      const updateUserDto = { name: 'Updated User' };

      await controller.updateUser(userId, updateUserDto);
      expect(service.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should throw HttpException for invalid user ID', async () => {
      const invalidId = 'invalid_id';
      const updateUserDto = { name: 'Updated User' };

      try {
        await controller.updateUser(invalidId, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete user for valid ID', async () => {
      const userId = '60e4f9d1b2f09b0024cbe9d2';

      await controller.deleteUser(userId);
      expect(service.deleteUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('createUserAdmin', () => {
    it('should call createUserAdmin on the service', async () => {
      const dto = {
        email: 'admin@example.com',
        password: 'securePassword123',
        name: 'Admin',
        role: 'admin',
      }; // Sample DTO matching CreateUserAdminDto

      await controller.createUserAdmin(dto);
      expect(service.createUserAdmin).toHaveBeenCalledWith(dto);
    });
  });
});
