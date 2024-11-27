import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './dto/sample.dto';
import { GetUserDto } from './dto/get-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async save(user: User): Promise<User> {
    try {
      user.password = await this.hashPassword(user.password);
      const newUser = await this.userModel.create(user);
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getByEmail(getUserDto: GetUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email: getUserDto.email });
    if (!user) {
      throw new NotFoundException(
        `User with email ${getUserDto.email} not found`,
      );
    }
    return user;
  }

  async put(id: string, user: User): Promise<User> {
    try {
      if (user.password) {
        user.password = await this.hashPassword(user.password);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: user },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async delete_user(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
