import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './dto/sample.dto';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: User) {
    try {
      const savedUser = await this.appService.save(user);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error creating user',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.appService.getById(id);
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Error retrieving user',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() user: User) {
    try {
      const updatedUser = await this.appService.put(id, user);
      if (!updatedUser) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Error updating user',
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    try {
      await this.appService.delete_user(id);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Error deleting user',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
