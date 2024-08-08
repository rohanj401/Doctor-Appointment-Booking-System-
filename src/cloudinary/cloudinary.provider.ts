import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class CloudinaryProvider {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  public getCloudinary() {
    return cloudinary;
  }

  public getStorage() {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'uploads',
        format: async (req, file) =>  ['jpg', 'jpeg', 'png'], 
        //public_id: (req, file) => file.originalname,
      }as unknown as any,
    });
  }
}
