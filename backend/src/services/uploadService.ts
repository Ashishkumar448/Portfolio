import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import path from 'path';
import { AppError } from '../utils/AppError';
import logger from '../config/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE!) || 5 * 1024 * 1024, // 5MB default
  },
});

class UploadService {
  async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    filename?: string,
    resourceType: 'image' | 'raw' = 'image'
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadOptions: any = {
          folder: `portfolio/${folder}`,
          resource_type: resourceType,
          quality: 'auto',
          fetch_format: 'auto',
        };

        if (filename) {
          uploadOptions.public_id = filename;
        }

        if (resourceType === 'image') {
          uploadOptions.transformation = [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ];
        }

        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload error:', error);
              reject(new AppError('File upload failed', 500));
            } else {
              resolve(result!.secure_url);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      logger.error('Upload service error:', error);
      throw new AppError('File upload failed', 500);
    }
  }

  async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`File deleted from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error('Cloudinary delete error:', error);
      throw new AppError('File deletion failed', 500);
    }
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  async uploadProjectImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadToCloudinary(
        file.buffer,
        'projects',
        `project_${Date.now()}_${index}`,
        'image'
      )
    );

    return Promise.all(uploadPromises);
  }

  async uploadBlogImage(file: Express.Multer.File): Promise<string> {
    return this.uploadToCloudinary(
      file.buffer,
      'blogs',
      `blog_${Date.now()}`,
      'image'
    );
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return this.uploadToCloudinary(
      file.buffer,
      'avatars',
      `avatar_${Date.now()}`,
      'image'
    );
  }

  async uploadSkillIcon(file: Express.Multer.File): Promise<string> {
    return this.uploadToCloudinary(
      file.buffer,
      'skills',
      `skill_${Date.now()}`,
      'image'
    );
  }
}

export default new UploadService();