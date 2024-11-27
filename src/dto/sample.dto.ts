import { IsEmail } from 'class-validator';

export class User {
  @IsEmail()
  email: string;

  name: string;

  password: string;

  phone: string;
}
