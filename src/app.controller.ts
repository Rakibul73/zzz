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
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './dto/sample.dto';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(new ValidationPipe({ whitelist: true }))
    user: User,
  ): Promise<User> {
    return this.appService.save(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.appService.getById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    user: User,
  ): Promise<User> {
    return this.appService.put(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.appService.delete_user(id);
  }
}
