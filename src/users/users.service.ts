import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/schemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  createUser(createpatientDto: CreateUserDto) {
    const createdUser = new this.userModel(createpatientDto);
    return createdUser.save();
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
