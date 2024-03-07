import { UserGender } from '@/common/enums/user.enum';
import {
  IsDateString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsDateString()
  dob: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;
}
