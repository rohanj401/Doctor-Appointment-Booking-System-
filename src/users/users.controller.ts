import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Query } from '@nestjs/common'; // Import Query decorator
import { CreateUserDoctorDto } from './dtos/create-user-doctor.dto';
import { CreateUserPatientDto } from './dtos/create-user-patient.dto';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public()
  @Post('/doctor')
  createUserDoctor(@Body() createUserDoctorDto: CreateUserDoctorDto) {
    console.log(` document  is ${JSON.stringify(createUserDoctorDto)}`);
    return this.usersService.createUserDoctor(createUserDoctorDto);
  }

  @Public()
  @Post('/patient')
  createUserPatient(@Body() createUserPatientDto: CreateUserPatientDto) {
    console.log(` document  is ${JSON.stringify(createUserPatientDto)}`);
    return this.usersService.createUserPatient(createUserPatientDto);
  }

  @Public()
  @Get()
  // @UseGuards(AuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
  @Public()
  @Get('/getUserByEmail')
  async getUserByEmail(@Query('email') email: string) {
    console.log('email is ' + email);
    return this.usersService.getUserByEmail(email);
  }

  @Get(':id')
  // @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    const user = await this.usersService.getUserById(id);
    if (!user) throw new HttpException('User Not Found ', 404);
    return user;
  }

  @Patch(':id')
  // @UseGuards(AuthGuard)
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
  // @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUserById(id);
  }

  //admin creation----------

  @Public()
  @Post('/admin')
  async createUserAdmin(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersService.createUserAdmin(createUserAdminDto);
  }
}
