import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'abc@gmail.com', required: true })
  @IsString()
  @IsEmail()
  email: string;
}
