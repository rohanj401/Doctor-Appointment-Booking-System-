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
    console.log(`File Object type is  : ${typeof file}`);
    // console.log(`Buffer : ${file.buffer}`);

    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        return reject(new Error('No file or file buffer is missing'));
      }

      console.log('Uploading file with size:', file.buffer.length);

      cloudinaryV2.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
