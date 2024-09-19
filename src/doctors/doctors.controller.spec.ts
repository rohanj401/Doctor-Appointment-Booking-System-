// import { Test, TestingModule } from '@nestjs/testing';
// import { DoctorsController } from './doctors.controller';

// describe('DoctorsController', () => {
//   let controller: DoctorsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DoctorsController],
//     }).compile();

//     controller = module.get<DoctorsController>(DoctorsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import { CancelSlotDto } from './dtos/cancel-slot.dto';

describe('DoctorsController', () => {
  let doctorsController: DoctorsController;
  let doctorsService: DoctorsService;

  const mockDoctorService = {
    addAvailability: jest.fn(),
    verifyDoctor: jest.fn(),
    cancelSlot: jest.fn(),
    cancelAllSlots: jest.fn(),
    fetchDoctorByUserId: jest.fn(),
    fetchAvailableDates: jest.fn(),
    findDoctors: jest.fn(),
    findNearbyDoctors: jest.fn(),
    getDoctorById: jest.fn(),
    getDoctors: jest.fn(),
    patchDoctor: jest.fn(),
    deleteDoctor: jest.fn(),
    searchDoctors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorsController],
      providers: [{ provide: DoctorsService, useValue: mockDoctorService }],
    }).compile();

    doctorsController = module.get<DoctorsController>(DoctorsController);
    doctorsService = module.get<DoctorsService>(DoctorsService);
  });

  it('should be defined', () => {
    expect(doctorsController).toBeDefined();
  });

  describe('addDoctorAvailability', () => {
    it('should call addAvailability from doctorsService', async () => {
      const mockData = { doctorId: '123', availability: [] };
      await doctorsController.addDoctorAvailability(mockData);
      expect(doctorsService.addAvailability).toHaveBeenCalledWith(mockData);
    });
  });

  describe('verifyDoctor', () => {
    it('should verify a doctor', async () => {
      const id = '123';
      await doctorsController.verifyDoctor(id);
      expect(doctorsService.verifyDoctor).toHaveBeenCalledWith(id);
    });
  });

  describe('cancelSlot', () => {
    it('should cancel a slot', async () => {
      const cancelSlotDto: CancelSlotDto = {
        doctorId: 'doctor123',
        date: '2024-09-20T00:00:00Z',
        slotId: 'slot123',
      };
      await doctorsController.cancelSlot(cancelSlotDto);
      expect(doctorsService.cancelSlot).toHaveBeenCalledWith(cancelSlotDto);
    });
  });

  describe('cancelAllSlots', () => {
    it('should cancel all slots for a given doctor and date', async () => {
      const mockBody = { doctorId: '123', date: '2024-09-16' };

      // Mock cancelAllSlots behavior
      doctorsService.cancelAllSlots = jest.fn().mockResolvedValue(true);

      await doctorsController.cancelAllSlots(mockBody);
      expect(doctorsService.cancelAllSlots).toHaveBeenCalledWith(
        mockBody.doctorId,
        new Date(mockBody.date), // Ensure date is passed correctly
      );
    });

    it('should throw a BadRequestException for invalid date format', async () => {
      const mockBody = { doctorId: '123', date: 'invalid-date' };
      await expect(doctorsController.cancelAllSlots(mockBody)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('fetchDoctorByUserId', () => {
    it('should fetch doctor by user ID', async () => {
      const userId = '123';

      // Mock the implementation to return some mock data
      doctorsService.fetchDoctorByUserId = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Dr. Smith',
        specialty: 'Cardiology',
      });

      await doctorsController.fetchDoctorByUserId(userId);
      expect(doctorsService.fetchDoctorByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException when doctor is not found', async () => {
      const userId = 'nonexistent';

      // Mock the implementation to throw an error
      doctorsService.fetchDoctorByUserId = jest.fn().mockImplementation(() => {
        throw new Error('Doctor not found');
      });

      await expect(
        doctorsController.fetchDoctorByUserId(userId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getAvailableDates', () => {
    it('should fetch available dates for a doctor', async () => {
      const doctorId = '123';
      await doctorsController.getAvailableDates(doctorId);
      expect(doctorsService.fetchAvailableDates).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('getDoctorss', () => {
    it('should get a list of doctors with the correct status and pagination', async () => {
      const status = 'verified';
      const page = 1;
      const pageSize = 10;
      await doctorsController.getDoctorss(status, page, pageSize);
      expect(doctorsService.findDoctors).toHaveBeenCalledWith(
        status,
        page,
        pageSize,
      );
    });
  });

  describe('findNearbyDoctors', () => {
    it('should find nearby doctors', async () => {
      const mockData = { location: [40.7128, -74.006], radius: 10 };
      await doctorsController.findNearbyDoctors(mockData);
      expect(doctorsService.findNearbyDoctors).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getDoctorById', () => {
    it('should get doctor by id', async () => {
      const doctorId = '60b8d295f1a2c603dc7efc8b'; // Use a valid ObjectId

      // Mock the service to return a valid doctor object
      doctorsService.getDoctorById = jest.fn().mockResolvedValue({
        _id: doctorId,
        name: 'Dr. Rohan Jawale',
      });

      const result = await doctorsController.getDoctorById(doctorId);
      expect(doctorsService.getDoctorById).toHaveBeenCalledWith(doctorId);
      expect(result).toEqual({
        _id: doctorId,
        name: 'Dr. Rohan Jawale',
      });
    });

    it('should throw an exception for an invalid ObjectId', async () => {
      const invalidId = 'invalid-id';
      await expect(doctorsController.getDoctorById(invalidId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateDoctor', () => {
    it('should throw an exception for an invalid ObjectId', async () => {
      const invalidId = 'invalid-id';
      const updateDoctorDto = { name: 'New Name' };

      // Mock isValid to return false for the invalid ID
      const isValidMock = jest
        .spyOn(mongoose.Types.ObjectId, 'isValid')
        .mockReturnValue(false);

      try {
        await doctorsController.updateDoctor(invalidId, updateDoctorDto);
        // Fail the test if no error is thrown
        fail('Expected HttpException to be thrown, but it was not.');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User Not Found');
        expect(error.status).toBe(404);
      }

      // Restore the original implementation after the test
      isValidMock.mockRestore();
    });
    it('should update doctor details', async () => {
      const doctorId = '60b8d295f1a2c603dc7efc8b'; // Valid ObjectId
      const updateDoctorDto = { name: 'New Doctor Name' };

      // Mock the isValid check to return true
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);

      // Mock the service's patchDoctor method
      doctorsService.patchDoctor = jest.fn().mockResolvedValue({
        _id: doctorId,
        name: 'New Doctor Name',
      });

      const result = await doctorsController.updateDoctor(
        doctorId,
        updateDoctorDto,
      );

      expect(doctorsService.patchDoctor).toHaveBeenCalledWith(
        doctorId,
        updateDoctorDto,
      );
      expect(result).toEqual({
        _id: doctorId,
        name: 'New Doctor Name',
      });
    });
  });

  describe('deleteDoctor', () => {
    it('should delete doctor by id', async () => {
      const doctorId = '123';
      await doctorsController.deleteDoctor(doctorId);
      expect(doctorsService.deleteDoctor).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('searchDoctors', () => {
    it('should search for doctors by criteria', async () => {
      const query = {
        state: 'NY',
        city: 'New York',
        specialty: 'Cardiology',
        gender: 'male',
        radius: '5',
        location: [40.7128, -74.006],
      };

      await doctorsController.searchDoctors(
        query.state,
        query.city,
        query.specialty,
        query.gender,
        query.radius,
        query.location as [number, number],
      );

      expect(doctorsService.searchDoctors).toHaveBeenCalledWith(
        query.state,
        query.city,
        query.specialty,
        query.gender,
        5, // Parsed radius as number
        query.location,
      );
    });

    it('should throw a BadRequestException for invalid radius', async () => {
      const query = {
        state: 'NY',
        city: 'New York',
        specialty: 'Cardiology',
        gender: 'male',
        radius: 'invalid',
        location: [40.7128, -74.006],
      };

      await expect(
        doctorsController.searchDoctors(
          query.state,
          query.city,
          query.specialty,
          query.gender,
          query.radius,
          query.location as [number, number],
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
