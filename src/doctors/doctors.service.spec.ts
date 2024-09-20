// import { Test, TestingModule } from '@nestjs/testing';
// import { DoctorsService } from './doctors.service';

// describe('DoctorsService', () => {
//   let service: DoctorsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [DoctorsService],
//     }).compile();

//     service = module.get<DoctorsService>(DoctorsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Doctor } from '../schemas/doctor.schema';
import { Rating } from '../schemas/Ratings.schema';
import { User } from '../schemas/User.schema';
import { Slot } from '../schemas/Slot.schema';
import { Prescription } from '../schemas/Prescription.schema';
import { Availability } from '../schemas/Availability.schema';
import { Appointment } from '../schemas/Appointment.schema';
import { Patient } from '../schemas/Patient.schema';
import { NotFoundException } from '@nestjs/common';
import { CancelSlotDto } from './dtos/cancel-slot.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let doctorModel: jest.Mocked<Model<Doctor>>;
  let ratingModel: jest.Mocked<Model<Rating>>;
  let userModel: jest.Mocked<Model<User>>;
  let slotModel: jest.Mocked<Model<Slot>>;
  let prescriptionModel: jest.Mocked<Model<Prescription>>;
  let availabilityModel: jest.Mocked<Model<Availability>>;
  let appointmentModel: jest.Mocked<Model<Appointment>>;
  let patientModel: jest.Mocked<Model<Patient>>;
  let mailerService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(), // Mock sendMail method
          },
        },
        {
          provide: getModelToken(Doctor.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            countDocuments: jest.fn().mockResolvedValue(0), // Mock countDocuments with a resolved value
            findOne: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockResolvedValue(null), // Mock findByIdAndUpdate with a resolved value
            findById: jest.fn().mockResolvedValue(null), // Mock findById with a resolved value
            findByIdAndDelete: jest.fn().mockResolvedValue(null), // Mock findByIdAndDelete with a resolved value
            updateOne: jest.fn().mockResolvedValue({}), // Mock updateOne with a resolved value
            exec: jest.fn().mockResolvedValue([]), // Mock exec to return an empty array
          },
        },
        {
          provide: getModelToken(Rating.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([]), // Mock exec to return an empty array
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockResolvedValue(null), // Mock findById with a resolved value
            exec: jest.fn().mockResolvedValue([]), // Mock exec to return an empty array
          },
        },
        {
          provide: getModelToken(Slot.name),
          useValue: {
            create: jest.fn().mockResolvedValue({}), // Mock create with a resolved value
          },
        },
        {
          provide: getModelToken(Prescription.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([]), // Mock exec to return an empty array
          },
        },
        {
          provide: getModelToken(Availability.name),
          useValue: {
            create: jest.fn().mockResolvedValue({}), // Mock create with a resolved value
          },
        },
        {
          provide: getModelToken(Appointment.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(), // Mock populate to return this for chaining
            exec: jest.fn().mockResolvedValue(null), // Mock exec to return null
            save: jest.fn().mockResolvedValue({}), // Mock save with a resolved value
          },
        },
        {
          provide: getModelToken(Patient.name),
          useValue: {
            findById: jest.fn().mockResolvedValue(null), // Mock findById with a resolved value
            exec: jest.fn().mockResolvedValue([]), // Mock exec to return an empty array
          },
        },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    doctorModel = module.get<Model<Doctor>>(
      getModelToken(Doctor.name),
    ) as jest.Mocked<Model<Doctor>>;
    ratingModel = module.get<Model<Rating>>(
      getModelToken(Rating.name),
    ) as jest.Mocked<Model<Rating>>;
    userModel = module.get<Model<User>>(
      getModelToken(User.name),
    ) as jest.Mocked<Model<User>>;
    slotModel = module.get<Model<Slot>>(
      getModelToken(Slot.name),
    ) as jest.Mocked<Model<Slot>>;
    prescriptionModel = module.get<Model<Prescription>>(
      getModelToken(Prescription.name),
    ) as jest.Mocked<Model<Prescription>>;
    availabilityModel = module.get<Model<Availability>>(
      getModelToken(Availability.name),
    ) as jest.Mocked<Model<Availability>>;
    appointmentModel = module.get<Model<Appointment>>(
      getModelToken(Appointment.name),
    ) as jest.Mocked<Model<Appointment>>;
    patientModel = module.get<Model<Patient>>(
      getModelToken(Patient.name),
    ) as jest.Mocked<Model<Patient>>;
    mailerService = module.get<MailerService>(
      MailerService,
    ) as jest.Mocked<MailerService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findDoctors', () => {
    it('should return a list of doctors with total count', async () => {
      const doctors = [{ _id: '1', name: 'Dr. A' }] as Doctor[];
      const total = 1;

      // Create a mock implementation for `find`
      const findMock = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(doctors), // Ensure exec returns a resolved value
      });

      const countDocumentsMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(total), // Ensure exec returns a resolved value
      });

      jest.spyOn(doctorModel, 'find').mockImplementation(findMock);
      jest
        .spyOn(doctorModel, 'countDocuments')
        .mockImplementation(countDocumentsMock);

      const result = await service.findDoctors('all', 1, 10);
      expect(result).toEqual({ doctors, total });
    });
  });

  describe('getDoctorById', () => {
    it('should return a doctor by ID', async () => {
      const doctor = { _id: '1' } as Doctor;

      // Mock findById to return an object with exec method
      jest.spyOn(doctorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(doctor),
      } as any);

      expect(await service.getDoctorById('1')).toEqual(doctor);
    });

    it('should throw NotFoundException if doctor not found', async () => {
      jest.spyOn(doctorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.getDoctorById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('patchDoctor', () => {
    it('should update a doctor', async () => {
      const doctor = { _id: '1', name: 'Dr. A' } as Doctor;
      const updateDto = { name: 'New Name' } as UpdateDoctorDto;

      // Mock findOne to return an object with exec method
      jest.spyOn(doctorModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(doctor), // Ensure exec returns a resolved value
      } as any);

      // Mock findByIdAndUpdate to return the updated doctor
      jest.spyOn(doctorModel, 'findByIdAndUpdate').mockResolvedValue(doctor);

      expect(await service.patchDoctor('1', updateDto)).toEqual(doctor);
    });

    it('should throw NotFoundException if doctor not found', async () => {
      jest.spyOn(doctorModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Ensure exec returns null
      } as any);

      await expect(
        service.patchDoctor('1', {} as UpdateDoctorDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('cancelSlot', () => {
    it('should cancel a slot and send cancellation email', async () => {
      const cancelSlotDto: CancelSlotDto = {
        doctorId: '507f191e810c19729de860ea',
        date: '2024-09-15',
        slotId: '507f191e810c19729de860eb',
      };

      jest.spyOn(doctorModel, 'updateOne').mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      } as any);

      const queryMock = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: 'appointmentId',
          patient: { _id: 'patientId', user: 'userId' },
          save: jest.fn().mockResolvedValue(true),
        }),
      };

      jest.spyOn(appointmentModel, 'findOne').mockReturnValue(queryMock as any);
      jest
        .spyOn(doctorModel, 'findById')
        .mockResolvedValue({ name: 'A' } as any);
      jest.spyOn(patientModel, 'findById').mockResolvedValue({
        _id: 'patientId',
        name: 'Patient',
        user: 'userId',
      } as any);
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue({ email: 'patient@example.com' } as any);
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);

      await service.cancelSlot(cancelSlotDto);

      expect(doctorModel.updateOne).toHaveBeenCalledWith(
        {
          _id: expect.any(Types.ObjectId),
          'availability.date': '2024-09-15',
          'availability.slots._id': expect.any(Types.ObjectId),
        },
        {
          $set: {
            'availability.$.slots.$[slot].status': 'cancelled',
          },
        },
        {
          arrayFilters: [{ 'slot._id': expect.any(Types.ObjectId) }],
          multi: true,
        },
      );

      expect(appointmentModel.findOne).toHaveBeenCalledWith({
        doctor: expect.any(Types.ObjectId),
        appointmentDate: '2024-09-15',
        slot: expect.any(Types.ObjectId),
      });

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'patient@example.com',
        subject: 'Appointment Cancellation Notice!',
        html: `
          <html>
            <body>
              <h1>Dear Patient,</h1>
              <p>
                We regret to inform you that your appointment scheduled for 2024-09-15 with Dr. A has been cancelled due to unforeseen circumstances.
              </p>
              <p>
                We apologize for any inconvenience this may cause. Please contact the hospital management team to reschedule your appointment at your earliest convenience.
              </p>
              <p>
                Thank you for your understanding.
              </p>
              <p>
                Best regards,<br />
                The Hospital Management Team
              </p>
            </body>
          </html>
        `,
      });
    });
  });

  describe('findNearbyDoctors', () => {
    it('should return doctors within the specified radius', async () => {
      const doctors = [
        { _id: '607c191e810c19729de860ea', name: 'Dr. A' },
        { _id: '607c191e810c19729de860eb', name: 'Dr. B' },
      ];

      const data = {
        userLatitude: 40.7128,
        userLongitude: -74.006,
        radiusInKm: 10,
      };

      jest.spyOn(doctorModel, 'find').mockResolvedValue(doctors as any);

      const result = await service.findNearbyDoctors(data);

      expect(doctorModel.find).toHaveBeenCalledWith({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [data.userLatitude, data.userLongitude],
            },
            $minDistance: 0,
            $maxDistance: data.radiusInKm * 1000,
          },
        },
      });

      expect(result).toEqual(doctors);
    });
  });
  describe('searchDoctors', () => {
    it('should return an empty array when no doctors match the search criteria', async () => {
      // Create a mock query object with an `exec` method
      const mockQuery = {
        exec: jest.fn().mockResolvedValue([]), // Mock `.exec()` to resolve with an empty array
      };

      // Mock `doctorModel.find` to return the mock query object
      (doctorModel.find as jest.Mock).mockReturnValue(mockQuery);

      // Call the service method with criteria that would result in no matches
      const result = await service.searchDoctors(
        'NY', // Valid state
        'Invalid City', // Invalid city
        'Cardiologist', // Valid speciality
        'M', // Valid gender
        10, // Valid radius in km
        [40.7128, -74.006], // Valid location
      );

      // Assert that `find` was called with the correct query
      expect(doctorModel.find).toHaveBeenCalledWith({
        'clinicDetails.state': 'NY',
        'clinicDetails.city': 'Invalid City',
        isVerified: true,
        speciality: 'Cardiologist',
        gender: 'M',
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [40.7128, -74.006], // [longitude, latitude] format
            },
            $minDistance: 0,
            $maxDistance: 10000, // 10 km in meters
          },
        },
      });

      // Expect the result to be an empty array as no doctors match the criteria
      expect(result).toEqual([]);
    });

    it('should handle errors and throw an appropriate message', async () => {
      // Create a mock query object with an `exec` method
      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Database error')), // Mock `.exec()` to reject with an error
      };

      // Mock `doctorModel.find` to return the mock query object
      (doctorModel.find as jest.Mock).mockReturnValue(mockQuery);

      // Ensure that the method throws an error with the expected message
      await expect(
        service.searchDoctors(
          'NY',
          'Invalid City',
          'Cardiologist',
          'M',
          10,
          [40.7128, -74.006],
        ),
      ).rejects.toThrow('Error fetching doctors');
    });
  });

  // describe('addAvailability', () => {
  //   let service: DoctorsService;

  //   it('should add availability to the doctor and return the updated doctor', async () => {
  //     // Create a complete mockDoctor object
  //     const mockDoctor: Doctor = {
  //       _id: new Types.ObjectId().toString(),
  //       user: new Types.ObjectId(), // Mocked ObjectId reference
  //       speciality: 'Orthopedic Surgeon',
  //       qualification: 'MS in Orthopedic Surgery',
  //       contactNumber: '1234567890',
  //       registrationNumber: 'REG123456',
  //       yearOfRegistration: '2005',
  //       stateMedicalCouncil: 'State Council',
  //       name: 'Dr. John Doe',
  //       bio: 'Experienced orthopedic surgeon',
  //       document: 'document-url',
  //       isVerified: true,
  //       isEmailVerified: true,
  //       gender: 'Male',
  //       profilePic: 'profile-pic-url',
  //       clinicDetails: {
  //         morningStartTime: '09:00',
  //         morningEndTime: '12:00',
  //         eveningStartTime: '14:00',
  //         eveningEndTime: '18:00',
  //         clinicName: 'Clinic Name',
  //         clinicAddress: 'Clinic Address',
  //         city: 'City',
  //         state: 'State',
  //         slotDuration: 15,
  //       },
  //       location: {
  //         type: 'Point',
  //         coordinates: [0, 0],
  //       },
  //       availability: [],
  //       save: jest.fn().mockResolvedValue({}), // Mock save method
  //     };

  //     const mockSlots = [
  //       { _id: 'slot-id-1', time: '09:00', status: 'available' },
  //       { _id: 'slot-id-2', time: '09:30', status: 'available' },
  //       { _id: 'slot-id-3', time: '10:00', status: 'available' },
  //       { _id: 'slot-id-4', time: '10:30', status: 'available' },
  //       { _id: 'slot-id-5', time: '14:00', status: 'available' },
  //       { _id: 'slot-id-6', time: '14:30', status: 'available' },
  //       { _id: 'slot-id-7', time: '15:00', status: 'available' },
  //       { _id: 'slot-id-8', time: '15:30', status: 'available' },
  //     ];

  //     const mockAvailability = [
  //       {
  //         _id: 'availability-id-1',
  //         date: '2024-09-01',
  //         slots: mockSlots.slice(0, 4),
  //         __v: 0,
  //       },
  //       {
  //         _id: 'availability-id-2',
  //         date: '2024-09-01',
  //         slots: mockSlots.slice(4),
  //         __v: 0,
  //       },
  //     ];

  //     doctorModel.findById.mockResolvedValue(mockDoctor);
  //     availabilityModel.create.mockResolvedValue(mockAvailability as any); // Type assertion to bypass type checks

  //     const data = {
  //       doctorId: 'doctor-id',
  //       dates: ['2024-09-01'],
  //       timePerSlot: 30,
  //     };

  //     const result = await service.addAvailability(data);

  //     expect(doctorModel.findById).toHaveBeenCalledWith(data.doctorId);
  //     expect(availabilityModel.create).toHaveBeenCalledWith({
  //       date: '2024-09-01',
  //       slots: expect.any(Array), // You can specify the expected slot structure if needed
  //     });
  //     expect(result).toEqual(mockDoctor);
  //   });

  //   it('should throw NotFoundException if the doctor is not found', async () => {
  //     doctorModel.findById.mockResolvedValue(null); // Simulate doctor not found

  //     const data = {
  //       doctorId: 'invalid-id',
  //       dates: ['2024-09-01'],
  //       timePerSlot: 30,
  //     };

  //     await expect(service.addAvailability(data)).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });

  //   it('should generate slots based on clinic timings and time per slot', () => {
  //     const mockDoctor: Doctor = {
  //       _id: new Types.ObjectId().toString(),
  //       user: new Types.ObjectId(), // Mocked ObjectId reference
  //       speciality: 'Orthopedic Surgeon',
  //       qualification: 'MS in Orthopedic Surgery',
  //       contactNumber: '1234567890',
  //       registrationNumber: 'REG123456',
  //       yearOfRegistration: '2005',
  //       stateMedicalCouncil: 'State Council',
  //       name: 'Dr. John Doe',
  //       bio: 'Experienced orthopedic surgeon',
  //       document: 'document-url',
  //       isVerified: true,
  //       isEmailVerified: true,
  //       gender: 'Male',
  //       profilePic: 'profile-pic-url',
  //       clinicDetails: {
  //         morningStartTime: '09:00',
  //         morningEndTime: '12:00',
  //         eveningStartTime: '14:00',
  //         eveningEndTime: '18:00',
  //       },
  //       location: {
  //         type: 'Point',
  //         coordinates: [0, 0],
  //       },
  //       availability: [],
  //       save: jest.fn().mockResolvedValue({}), // Mock save method
  //     };

  //     const slots = service['generateSlotsForDay'](
  //       '2024-09-01',
  //       30,
  //       mockDoctor,
  //     );

  //     expect(slots).toEqual([
  //       { time: '09:00', status: 'available' },
  //       { time: '09:30', status: 'available' },
  //       { time: '10:00', status: 'available' },
  //       { time: '10:30', status: 'available' },
  //       { time: '14:00', status: 'available' },
  //       { time: '14:30', status: 'available' },
  //       { time: '15:00', status: 'available' },
  //       { time: '15:30', status: 'available' },
  //     ]);
  //   });
  // });
  // Add more tests for other methods as needed
});
