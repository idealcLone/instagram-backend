import { IsNumber } from 'class-validator';

export class SubscriberDto {
  @IsNumber()
  userId: number;

  sse: (data: string) => void;
}
