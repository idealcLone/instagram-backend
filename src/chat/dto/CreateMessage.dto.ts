import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  chatHistoryId: number;

  @IsNumber()
  userId: number;

  @IsString()
  text: string;
}
