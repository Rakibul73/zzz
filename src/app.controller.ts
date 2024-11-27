import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './dto/sample.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async save(@Body() user: User) {
    return await this.appService.save(user);
  }

  @Get()
  async get(@Body() getUserDto: GetUserDto) {
    return await this.appService.get(getUserDto);
  }

  @Put(':id')
  async put(@Query('id') id: string, @Body() user: User) {
    return await this.appService.put(id, user);
  }

  @Delete(':id')
  async delete_user(@Query('id') id: string) {
    await this.appService.delete_user(id);
  }
}
