import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Delete,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Query } from '@nestjs/common'; // Import Query decorator
import { Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto';
import { CreateUserPatientDto } from './dtos/create-user-patient.dto';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  @Post('/doctor')
  createUserDoctor(
    @Body() createUserDoctorDto: CreateUserDoctorDto,
  ) {

    console.log(` document  is ${JSON.stringify(createUserDoctorDto)}`);
    return this.usersService.createUserDoctor(createUserDoctorDto);
  }

  @Post('/patient')
  createUserPatient(
    @Body() createUserPatientDto: CreateUserPatientDto,
  ) {

    console.log(` document  is ${JSON.stringify(createUserPatientDto)}`);
    return this.usersService.createUserPatient(createUserPatientDto);
  }


  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    console.log(`token is ${token}`);

    try {
      await this.usersService.verifyEmail(token);
      // Redirect to login or success page
      res.send('Email verified successfully!');
    } catch (error) {
      // Redirect to error page or show error message
      // return res.redirect('http://localhost:3000/login?verification=error');
    }
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    const user = await this.usersService.getUserById(id);
    if (!user) throw new HttpException('User Not Found ', 404);
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    return await this.usersService.updateUser(id, updateUserDto);
  }


  // Endpoint to delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUserById(id);
  }



  //admin creation----------

  @Post('/admin')
  async createUserAdmin(
    @Body() createUserAdminDto: CreateUserAdminDto,
  ) {
    return this.usersService.createUserAdmin(createUserAdminDto);
  }


}
