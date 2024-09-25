import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { DoctorsService } from './doctors.service';
import { CancelSlotDto } from './dtos/cancel-slot.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) { }

  @Post('/addAvailability')
  async addDoctorAvailability(@Body() data: any) {
    console.log(data);
    return this.doctorsService.addAvailability(data);
  }

  @UseGuards(AdminGuard)
  @Post(':id/verify')
  async verifyDoctor(@Param('id') id: string) {
    return this.doctorsService.verifyDoctor(id);
  }

  @Patch('/disable/:id')
  async disableDoctor(@Param('id') id: string) {
    return this.doctorsService.disableDoctor(id);
  }

  @Patch('/cancelSlot')
  async cancelSlot(@Body() cancelSlotDto: CancelSlotDto): Promise<void> {
    console.log('Cancelling slot ');
    return await this.doctorsService.cancelSlot(cancelSlotDto);
  }

  @Patch('/cancelAllSlots')
  async cancelAllSlots(@Body() body: { doctorId: string; date: string }) {
    const { doctorId, date } = body;
    console.log('Cancelling all slots');
    try {
      // Ensure date is a valid ISO date string
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
      }

      const result = await this.doctorsService.cancelAllSlots(
        doctorId,
        parsedDate,
      );
      if (
        result.message === 'Doctor not found' ||
        result.message === 'No availability found for the given date'
      ) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }

      return { message: result.message };
    } catch (error) {
      throw new HttpException(
        `Error canceling all slots: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('/fetchDoctorByUserId/:id')
  async fetchDoctorByUserId(@Param('id') id: string) {
    try {
      return this.doctorsService.fetchDoctorByUserId(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/getAvailableDates/:id')
  async getAvailableDates(@Param('id') id: string) {
    try {
      return await this.doctorsService.fetchAvailableDates(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get('/getAllDoctors-Admin')
  async getDoctorss(
    @Query('status') status: 'all' | 'verified' | 'unverified' = 'all',
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    console.log('getting all doctors');
    const result = await this.doctorsService.findDoctors(
      status,
      page,
      pageSize,
    );
    return result;
  }

  @Get('getNearByDoctors')
  findNearbyDoctors(@Body() data: any) {
    console.log('Finding nearBy Doctors');
    return this.doctorsService.findNearbyDoctors(data);
  }

  @Get('/getDoctorById/:id')
  async getDoctorById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Doctor Not Found', 404);
    const doctor = await this.doctorsService.getDoctorById(id);
    if (!doctor) throw new HttpException('Doctor Not Found ', 404);
    return doctor;
  }

  @Public()
  @Get()
  getDoctors() {
    console.log('Fetching All Doctors from the controller');
    return this.doctorsService.getDoctors();
  }

  @Patch(':id')
  updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    return this.doctorsService.patchDoctor(id, updateDoctorDto);
  }

  @Delete(':id')
  async deleteDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorsService.deleteDoctor(id);
  }

  @Get('search')
  async searchDoctors(
    @Query('state') state: string,
    @Query('city') city: string,
    @Query('specialty') specialty?: string,
    @Query('gender') gender?: string,
    @Query('radius') radius?: string, // Accept radius as string for easier parsing
    @Query('location') location?: [number, number], // Accept location as string for easier parsing
  ) {
    // Validate and parse radius
    const radiusInKm = radius ? parseFloat(radius) : undefined;
    if (radius && isNaN(radiusInKm)) {
      throw new BadRequestException('Invalid radius');
    }

    return this.doctorsService.searchDoctors(
      state,
      city,
      specialty,
      gender,
      radiusInKm,
      location,
    );
  }
}
