import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from 'src/schemas/Ratings.schema';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingsService) {}

  @Post()
  @Roles(Role.Patient)
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    return this.ratingService.createRating(createRatingDto);
  }

  @Get()
  @Roles(Role.Doctor, Role.Patient)
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingService.getAllRatings();
  }

  @Get(':id')
  @Roles(Role.Doctor, Role.Patient)
  async getRatingById(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.getRatingById(id);
  }

  @Get('doctor/:doctor_id')
  async getRatingsForDoctor(
    @Param('doctor_id') doctor_id: string,
  ): Promise<Rating[]> {
    return this.ratingService.getRatingsForDoctor(doctor_id);
  }

  @Get('appointment/:appointment_id')
  @Roles(Role.Patient, Role.Doctor)
  async getRatingsForappointment(
    @Param('appointment_id') appointment_id: string,
  ): Promise<Rating[]> {
    return this.ratingService.getRatingsByAppointmentId(appointment_id);
  }
  @Patch(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.ratingService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  async deleteRating(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.deleteRating(id);
  }
}
