import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      s3ForcePathStyle: false,
      endpoint: `https://${process.env.S3_REGION}.digitaloceanspaces.com`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map(async (file) => await this.uploadFile(file)));
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();

    return uploadResult.Key;
  }

  mapStorageUrl = (key: string) => {
    return `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_REGION}.cdn.digitaloceanspaces.com/${key}`;
  };
}
