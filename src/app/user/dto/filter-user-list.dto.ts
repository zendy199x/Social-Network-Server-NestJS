import { IsOptional, IsString } from 'class-validator';

export class FilterUserListDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  orderBy: 'ASC' | 'DESC';
}
