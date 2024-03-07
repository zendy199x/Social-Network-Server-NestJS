import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  identifier: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
