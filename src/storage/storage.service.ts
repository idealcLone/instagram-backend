import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_REGION'),
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map(async (file) => await this.uploadFile(file)));
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
      })
      .promise();

    return uploadResult.Key;
  }

  mapStorageUrl = (key: string) => {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  };
}
