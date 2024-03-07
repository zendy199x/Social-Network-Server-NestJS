import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
