import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { DoctorsService } from './doctors.service';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post('/addAvailability')
  async addDoctorAvailability(
    @Body() data: any,
    // @Body('dates') dates: string[],
    // @Body('timePerSlot') timePerSlot: number,
  ) {
    console.log(data);
    return this.doctorsService.addAvailability(data);
  }

  @Get()
  getDoctors() {
    return this.doctorsService.getDoctors();
  }

  @Get('getNearByDoctors')
  findNearbyDoctors(@Body() data: any) {
    console.log('Finding nearBy Doctors');
    return this.doctorsService.findNearbyDoctors(data);
  }

  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Doctor Not Found', 404);
    const doctor = await this.doctorsService.getDoctorById(id);
    if (!doctor) throw new HttpException('Doctor Not Found ', 404);
    return doctor;
  }

  // @Patch(':id')
  // @UseInterceptors(AnyFilesInterceptor())
  // async updateDoctor(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Param('id') id: string,
  //   @Body() updateDoctorDto: UpdateDoctorDto,
  // ) {
  //   const isValid = mongoose.Types.ObjectId.isValid(id);
  //   if (!isValid) throw new HttpException('Doctor Not Found', 404);
  //   const document = files.find((file) => file.fieldname === 'document');
  //   const profilePic = files.find((file) => file.fieldname === 'profilePic');

  //   if (document) {
  //     updateDoctorDto.document = document;
  //   }
  //   if (profilePic) {
  //     updateDoctorDto.profilePic = profilePic;
  //   }
  //   return this.doctorsService.updateDoctor(id, updateDoctorDto);
  // }

  @Delete(':id')
  async deleteDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorsService.deleteDoctor(id);
  }
}
