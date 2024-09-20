// import { Test, TestingModule } from '@nestjs/testing';
// import { PatientsController } from './patients.controller';

// describe('PatientsController', () => {
//   let controller: PatientsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [PatientsController],
//     }).compile();

//     controller = module.get<PatientsController>(PatientsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import mongoose from 'mongoose';
import { HttpException } from '@nestjs/common';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatient = {
    _id: '60a7f2d5c87ec231d83df470',
    name: 'John Doe',
    mobileNo: '+1234567890',
    bloodGroup: 'O+',
    gender: 'Male',
    profilePic: 'profile-pic-url',
  };

  const mockPatientsService = {
    createPatient: jest.fn().mockResolvedValue(mockPatient),
    getPatients: jest.fn().mockResolvedValue([mockPatient]),
    fetchPatientByUserId: jest.fn().mockResolvedValue(mockPatient),
    getPatientById: jest.fn().mockResolvedValue(mockPatient),
    updateUser: jest.fn().mockResolvedValue(mockPatient),
    deletePatient: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new patient', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        mobileNo: '+1234567890',
        bloodGroup: 'O+',
        gender: 'Male',
        profilePic: 'profile-pic-url',
      };
      expect(await controller.createUser(createPatientDto)).toEqual(
        mockPatient,
      );
      expect(service.createPatient).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('getPatients', () => {
    it('should return all patients', async () => {
      expect(await controller.getPatients()).toEqual([mockPatient]);
      expect(service.getPatients).toHaveBeenCalled();
    });
  });

  describe('fetchPatientByUserId', () => {
    it('should fetch patient by user ID', async () => {
      const userId = '60a7f2d5c87ec231d83df470';
      expect(await controller.fetchPatientByUserId(userId)).toEqual(
        mockPatient,
      );
      expect(service.fetchPatientByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('getPatientById', () => {
    it('should return patient by id', async () => {
      const patientId = '60a7f2d5c87ec231d83df470';
      expect(await controller.getPatientById(patientId)).toEqual(mockPatient);
      expect(service.getPatientById).toHaveBeenCalledWith(patientId);
    });

    it('should throw 404 if patient id is invalid', async () => {
      const invalidId = '1234';
      await expect(controller.getPatientById(invalidId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updatePatient', () => {
    it('should update a patient by id', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'John Smith',
        mobileNo: '+0987654321',
        bloodGroup: 'A+',
        gender: 'Male',
        profilePic: 'new-profile-pic-url',
      };
      const patientId = '60a7f2d5c87ec231d83df470';

      expect(
        await controller.updatePatient(patientId, updatePatientDto),
      ).toEqual(mockPatient);
      expect(service.updateUser).toHaveBeenCalledWith(
        patientId,
        updatePatientDto,
      );
    });

    it('should throw 404 if patient id is invalid', async () => {
      const invalidId = '1234';
      const updatePatientDto: UpdatePatientDto = {
        name: 'John Smith',
        mobileNo: '+0987654321',
        bloodGroup: 'A+',
        gender: 'Male',
        profilePic: 'new-profile-pic-url',
      };
      await expect(
        controller.updatePatient(invalidId, updatePatientDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient by id', async () => {
      const patientId = '60a7f2d5c87ec231d83df470';
      expect(await controller.deletePatient(patientId)).toBeUndefined();
      expect(service.deletePatient).toHaveBeenCalledWith(patientId);
    });
  });
});
