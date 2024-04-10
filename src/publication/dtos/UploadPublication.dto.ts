import { IsOptional, IsString } from 'class-validator';

export class UploadPublicationDto {
  @IsString()
  @IsOptional()
  description?: string;
}
