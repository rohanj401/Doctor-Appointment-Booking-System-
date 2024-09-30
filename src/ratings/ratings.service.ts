import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from 'src/schemas/Ratings.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorsService: DoctorsService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    const { doctor, patient, rating, comment, appointment } = createRatingDto;
    const doctorData = await this.doctorsService.getDoctorById(
      doctor.toString(),
    );
    if (!doctorData) {
      throw new NotFoundException('Doctor not found.');
    }
    const patientData = await this.patientsService.getPatientById(
      patient.toString(),
    );

    if (!patientData) {
      throw new NotFoundException('Patient not found.');
    }

    const appointmentData = await this.appointmentsService.getAppointmentById(
      appointment.toString(),
    );
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

  async getAverageRating(doctorId: string | Types.ObjectId): Promise<number> {
    // Ensure doctorId is in ObjectId format
    const doctorObjectId =
      typeof doctorId === 'string' ? new Types.ObjectId(doctorId) : doctorId;

    const ratings = await this.ratingModel
      .find({ doctor: doctorObjectId })
      .exec();

    if (ratings.length === 0) {
      return 0;
    }

    const avgRating =
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;

    return avgRating;
  }
  async updateRating(
    id: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const { doctor, patient } = updateRatingDto;

    const appointment = await this.appointmentsService.findCompletedAppointment(
      doctor,
      patient,
    );

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
