import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UploadPublicationDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  userId: number;
}
