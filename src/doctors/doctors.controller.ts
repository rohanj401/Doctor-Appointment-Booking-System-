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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) { }

  @Post('/addAvailability')
  async addDoctorAvailability(@Body() data: any) {
    return this.doctorsService.addAvailability(data);
  }

  @Post(':id/verify')
  @Roles(Role.Admin)
  async verifyDoctor(@Param('id') id: string) {
    return this.doctorsService.verifyDoctor(id);
  }

  @Patch('/disable/:id')
  @Roles(Role.Admin)
  async disableDoctor(@Param('id') id: string) {
    return this.doctorsService.disableDoctor(id);
  }

  @Patch('/cancelSlot')
  @Roles(Role.Doctor)
  async cancelSlot(@Body() cancelSlotDto: CancelSlotDto): Promise<void> {
    console.log('Cancelling slot ');
    return await this.doctorsService.cancelSlot(cancelSlotDto);
  }

  @Patch('/cancelAllSlots')
  @Roles(Role.Doctor)
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
  @Roles(Role.Doctor)
  async fetchDoctorByUserId(@Param('id') id: string) {
    try {
      return this.doctorsService.fetchDoctorByUserId(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/getAvailableDates/:id')
  @Roles(Role.Doctor, Role.Patient)
  async getAvailableDates(@Param('id') id: string) {
    try {
      return await this.doctorsService.fetchAvailableDates(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get('/getAllDoctors-Admin')
  @Roles(Role.Admin)
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

  @Get('/getDoctorById/:id')
  @Roles(Role.Patient, Role.Doctor, Role.Admin)
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
    return this.doctorsService.getDoctors();
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Doctor)
  updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    return this.doctorsService.patchDoctor(id, updateDoctorDto);
  }

  @Get('search')
  @Roles(Role.Patient)
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
