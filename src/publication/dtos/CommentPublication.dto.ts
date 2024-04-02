import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentPublicationDto {
  @IsNumber()
  @IsOptional()
  parentCommentId?: number;

  @IsString()
  text: string;
}
