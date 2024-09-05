import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Rating } from 'src/schemas/Ratings.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Doctor } from 'src/schemas/doctor.schema';
import { Patient } from 'src/schemas/Patient.schema';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Doctor.name) private doctorModel: Model<Appointment>,
    @InjectModel(Patient.name) private patientModel: Model<Appointment>,
  ) {}

  async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    const { doctor, patient, rating, comment, appointment } = createRatingDto;
    const doctorData = await this.doctorModel.findById(doctor).exec();

    if (!doctorData) {
      throw new NotFoundException('Doctor not found.');
    }
    const patientData = await this.patientModel.findById(patient).exec();

    if (!patientData) {
      throw new NotFoundException('Patient not found.');
    }

    const appointmentData = await this.appointmentModel
      .findById(appointment)
      .exec();
    console.log('appointmentData', appointmentData);
    if (!appointmentData) {
      throw new BadRequestException(
        'No approved appointment found for this patient with the doctor.',
      );
    }

    const ratings = new this.ratingModel({
      doctor: doctorData._id,
      patient: patientData._id,
      appointment: appointmentData._id,
      rating,
      comment,
    });
    console.log('rating:', ratings);
    return ratings.save();
  }
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingModel
      .find()
      .populate('doctor', 'name profilePic')
      .populate('patient', 'name profilePic')
      .exec();
  }

  async getRatingsForDoctor(doctorId: string): Promise<Rating[]> {
    let doctor = new Types.ObjectId(doctorId);
    return this.ratingModel
      .find({ doctor })
      .populate('patient', 'name profilePic')
      .exec();
  }
  async getRatingsByAppointmentId(appointmentId: string): Promise<Rating[]> {
    console.log(appointmentId);
    let appointment = new Types.ObjectId(appointmentId);
    return this.ratingModel
      .find({ appointment })
      .populate('patient', 'name profilePic')
      .exec();
  }
  async getRatingById(id: string): Promise<Rating> {
    const rating = await this.ratingModel
      .findById(id)
      .populate('doctor', 'name')
      .populate('patient', 'name')
      .exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }
  async updateRating(
    id: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const { doctor, patient } = updateRatingDto;
    const doctorObjectId = new Types.ObjectId(doctor);
    const patientObjectId = new Types.ObjectId(patient);

    const appointment = await this.appointmentModel.findOne({
      doctor: doctor,
      patient: patient,
      status: 'completed',
    });
    if (!appointment) {
      throw new BadRequestException(
        'No approved appointment found for this patient with doctor.',
      );
    }
    const existingRating = await this.ratingModel
      .findByIdAndUpdate(id, updateRatingDto, { new: true })
      .exec();
    if (!existingRating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return existingRating;
  }

  async deleteRating(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findByIdAndDelete(id).exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }
}
