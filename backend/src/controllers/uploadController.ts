import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/response';
import uploadService from '../services/uploadService';

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No file provided', 400));
    }

    const folder = req.body.folder || 'general';
    const url = await uploadService.uploadToCloudinary(
      req.file.buffer,
      folder,
      undefined,
      req.file.mimetype.startsWith('image/') ? 'image' : 'raw'
    );

    sendSuccess(res, 'File uploaded successfully', { url });
  } catch (error) {
    next(error);
  }
};

export const uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new AppError('No files provided', 400));
    }

    const folder = req.body.folder || 'general';
    const uploadPromises = req.files.map((file, index) =>
      uploadService.uploadToCloudinary(
        file.buffer,
        folder,
        `${Date.now()}_${index}`,
        file.mimetype.startsWith('image/') ? 'image' : 'raw'
      )
    );

    const urls = await Promise.all(uploadPromises);

    sendSuccess(res, 'Files uploaded successfully', { urls });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return next(new AppError('Public ID is required', 400));
    }

    await uploadService.deleteFromCloudinary(publicId);

    sendSuccess(res, 'File deleted successfully');
  } catch (error) {
    next(error);
  }
};