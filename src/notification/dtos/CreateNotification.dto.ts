import { IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  text: string;

  @IsString()
  link: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  authorUserId: number;
}
