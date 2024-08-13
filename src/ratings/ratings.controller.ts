import { Controller, Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from 'src/schemas/Ratings.schema';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingsService) {}

  @Post()
  async createRating(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingService.createRating(createRatingDto);
  }

  @Get()
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingService.getAllRatings();
  }

  @Get(':id')
  async getRatingById(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.getRatingById(id);
  }

  @Get('doctor/:doctor_id')
  async getRatingsForDoctor(@Param('doctor_id') doctor_id: string): Promise<Rating[]> {
    return this.ratingService.getRatingsForDoctor(doctor_id);
  }

  @Patch(':id')
  async updateRating(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto): Promise<Rating> {
    return this.ratingService.updateRating(id, updateRatingDto);
  }

  @Delete(':id')
  async deleteRating(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.deleteRating(id);
  }
}
