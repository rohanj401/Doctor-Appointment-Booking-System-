// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinaryV2.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(file.buffer);
    });
  }
}
