import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/schemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  async getUserByEmail(email) {
    try {
      console.log(email);
      // Ensure the `email` field is correctly defined in your schema
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error; // or handle error as needed
    }
  }

  // async createUser(createUserDto: CreateUserDto) {
  //   let User = new this.userModel(createUserDto);
  //   const userr = await this.getUserByEmail(User.email);
  //   if (!userr) {
  //     const password = await bcrypt.hash(User.password, 10);
  //     await this.User.save({ ...User, password });
  //   }
  // }

  async createUser(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    const userr = await this.getUserByEmail(user.email);
    if (!userr) {
      //addedfor email verification
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JwtSecret,
        expiresIn: '1h',
      });
      console.log(`Toke is ${token}`);
      const url = `http://localhost:3000/users/verify-email?token=${token}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Email Verification',
        // template: './verify-email', // Path to your email template
        // context: {
        //   url,
        // },
        html: `Hello ,<br>Verify : <p>${url}</p>`,
      });
      //till here
      const password = await bcrypt.hash(user.password, 10);
      user.password = password;
      await user.save();
    } else {
      throw new BadRequestException('User with this email-Id Allready Exist ');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    console.log('Verifying Users Email');
    let payload;
    try {
      // Verify the JWT token
      payload = this.jwtService.verify(token, {
        secret: process.env.JwtSecret,
      });
      console.log(payload);
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.userModel.findOne({ email: payload.email }).exec();

    if (user) {
      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already verified');
      }
      user.isEmailVerified = true;
      await user.save();
      return;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  getUsers() {
    return this.userModel.find();
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id);
  }

  //   async updateUser(id: string, updateUserDto: UpdateUserDto) {
  //     return await this.userModel.findByIdAndUpdate(id, UpdateUserDto, {
  //       new: true,
  //     });
  //   }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Validate the ID format before trying to update
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('Invalid user ID');
    }

    // Perform the update operation
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true, // Ensure the update adheres to the schema
      })
      .exec(); // Ensure to use exec() to handle promises correctly

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    // Validate the ID format
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new NotFoundException('Invalid user ID');
    }

    // Perform the delete operation
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }
}
