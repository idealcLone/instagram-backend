import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  username?: string = '';

  @IsString()
  @IsOptional()
  avatar?: string = '';
}
