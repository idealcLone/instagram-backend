import { IsString } from 'class-validator';

export class LoginOAuthDto {
  @IsString()
  token: string;
}
