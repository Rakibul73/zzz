import { IsEmail, IsString, MinLength } from 'class-validator';

export class User {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  phone: string;
}
