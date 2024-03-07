import { IsString, MinLength, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @Length(6)
  code: string;
}
