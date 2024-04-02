import { IsArray } from 'class-validator';

export class InitiateChatDto {
  @IsArray()
  users: number[];
}
