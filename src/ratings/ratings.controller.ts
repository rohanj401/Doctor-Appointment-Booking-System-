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

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    console.log(createRatingDto);
    return this.ratingService.createRating(createRatingDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingService.getAllRatings();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getRatingById(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.getRatingById(id);
  }

  @Get('doctor/:doctor_id')
  @UseGuards(AuthGuard)
  async getRatingsForDoctor(
    @Param('doctor_id') doctor_id: string,
  ): Promise<Rating[]> {
    return this.ratingService.getRatingsForDoctor(doctor_id);
  }

  @Get('appointment/:appointment_id')
  @UseGuards(AuthGuard)
  async getRatingsForappointment(
    @Param('appointment_id') appointment_id: string,
  ): Promise<Rating[]> {
    return this.ratingService.getRatingsByAppointmentId(appointment_id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.ratingService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteRating(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.deleteRating(id);
  }
}
