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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  @Post()
  // @UseInterceptors(AnyFilesInterceptor())
  createUser(
    // @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createUserDto: CreateUserDto,
  ) {
    // const document = files.find((file) => file.fieldname === 'document');
    // const profilePic = files.find((file) => file.fieldname === 'profilePic');

    // if (document) {
    //   createUserDto.document = document;
    // }
    // if (profilePic) {
    //   createUserDto.profilePic = profilePic;
    // }
    console.log(` document  is ${JSON.stringify(createUserDto)}`);
    // console.log(`Request Objest is : ${JSON.stringify(createUserDto)}`);
    return this.usersService.createUser(createUserDto);
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

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const deletedUser = await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully', user: deletedUser };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
