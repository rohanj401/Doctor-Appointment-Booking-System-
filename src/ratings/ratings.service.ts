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
    const { doctor, patient, rating, comment } = createRatingDto;
    const doctorr = await this.doctorModel.findById(doctor).exec();

    if (!doctorr) {
      throw new NotFoundException('Doctor not found.');
    }
    const patientt = await this.patientModel.findById(patient).exec();

    if (!patientt) {
      throw new NotFoundException('Patient not found.');
    }

    const appointment = await this.appointmentModel.findOne({
      doctor: doctorr._id,
      patient: patientt._id,
      status: 'accepted',
    });
    console.log('Appointment:', appointment);
    if (!appointment) {
      throw new BadRequestException(
        'No approved appointment found for this patient with the doctor.',
      );
    }

    const ratings = new this.ratingModel({
      doctor: doctorr._id,
      patient: patientt._id,
      rating,
      comment,
    });
    console.log('rating:', rating);
    return ratings.save();
  }
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingModel
      .find()
      .populate('doctor', 'name')
      .populate('patient', 'name')
      .exec();
  }

  async getRatingsForDoctor(doctor: string): Promise<Rating[]> {
    return this.ratingModel
      .find({ doctor })
      .populate('patient_id', 'name')
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
      status: 'accepted',
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
