import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from 'src/schemas/Appointment.schema';
import { Rating } from 'src/schemas/Ratings.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
    constructor(
        @InjectModel(Rating.name) private ratingModel: Model<Rating>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    ){}
    
    async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
        const { doctor_id, patient_id } = createRatingDto;

        const doctorObjectId = new Types.ObjectId(doctor_id);
        const patientObjectId = new Types.ObjectId(patient_id);
    
        const appointment = await this.appointmentModel.findOne({
          doctor: doctor_id,
          patient: patient_id,
           status: 'accepted',
        });
        console.log('Appointment:', appointment); 
        if (!appointment) {
          throw new BadRequestException(
            'No approved appointment found for this patient with the doctor.',
          );
        }
        
        const rating = new this.ratingModel(createRatingDto);
        return rating.save();
      }
      async getAllRatings(): Promise<Rating[]> {
        return this.ratingModel.find().populate('doctor_id', 'name').populate('patient_id', 'name').exec();
      }
  
      async getRatingsForDoctor(doctor_id: string): Promise<Rating[]> {
        return this.ratingModel.find({ doctor_id }).populate('patient_id', 'name').exec();
      }
  async getRatingById(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findById(id).populate('doctor_id', 'name').populate('patient_id', 'name').exec();
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }
  async updateRating(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const { doctor_id, patient_id } = updateRatingDto;    
    const doctorObjectId = new Types.ObjectId(doctor_id);
        const patientObjectId = new Types.ObjectId(patient_id);
    
        const appointment = await this.appointmentModel.findOne({
          doctor: doctor_id,
          patient: patient_id,
           status: 'accepted',
        });
        if (!appointment) {
          throw new BadRequestException(
            'No approved appointment found for this patient with doctor.',
          );
        }
    const existingRating = await this.ratingModel.findByIdAndUpdate(id, updateRatingDto, { new: true }).exec();
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
