import { Injectable } from '@nestjs/common';
import { User } from './dto/sample.dto';
import { GetUserDto } from './dto/get-user.dto';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  private readonly encryptionKey: Buffer;
  private readonly ivLength = 16;

  constructor(
    @InjectModel(User.name)
    private professionalModel: Model<User>,
  ) {}

  private async encrypt(text: string): Promise<string> {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  async save(user: User) {
    // user.password = await this.encrypt(user.password);
    return this.professionalModel.create(user);
  }

  async get(getUserDto: GetUserDto) {
    return this.professionalModel.findOne({ email: getUserDto.email });
  }

  async put(id: string, user: User) {
    // user.password = await this.encrypt(user.password);
    return await this.professionalModel.findOneAndUpdate({ _id: id }, user);
  }

  async delete_user(id: string) {
    await this.professionalModel.deleteOne({ _id: id });
  }
}
