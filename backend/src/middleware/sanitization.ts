import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Sanitize HTML content
export const sanitizeHtml = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value);
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  next();
};

// Remove null bytes and control characters
export const removeNullBytes = (req: Request, res: Response, next: NextFunction) => {
  const cleanValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }
    if (Array.isArray(value)) {
      return value.map(cleanValue);
    }
    if (typeof value === 'object' && value !== null) {
      const cleaned: any = {};
      for (const key in value) {
        cleaned[key] = cleanValue(value[key]);
      }
      return cleaned;
    }
    return value;
  };

  if (req.body) {
    req.body = cleanValue(req.body);
  }
  
  next();
};

// Normalize whitespace
export const normalizeWhitespace = (req: Request, res: Response, next: NextFunction) => {
  const normalizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(/\s+/g, ' ').trim();
    }
    if (Array.isArray(value)) {
      return value.map(normalizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const normalized: any = {};
      for (const key in value) {
        normalized[key] = normalizeValue(value[key]);
      }
      return normalized;
    }
    return value;
  };

  if (req.body) {
    req.body = normalizeValue(req.body);
  }
  
  next();
};

// Validate file uploads
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (req.files || req.file) {
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];
    
    for (const file of files) {
      if (!file) continue;
      
      // Check file size
      const maxSize = parseInt(process.env.MAX_FILE_SIZE!) || 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} exceeds maximum size of ${maxSize / 1024 / 1024}MB`
        });
      }
      
      // Sanitize filename
      file.originalname = validator.escape(file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
      
      // Check for executable extensions
      const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.php', '.asp', '.jsp'];
      const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (dangerousExtensions.includes(fileExt)) {
        return res.status(400).json({
          success: false,
          message: `File type ${fileExt} is not allowed`
        });
      }
    }
  }
  
  return next();
};

// Rate limit by IP and user
export const trackRequestMetrics = (req: Request, res: Response, next: NextFunction): void => {
  // Add request metadata for analytics
  (req as any).requestMetadata = {
    ip: req.ip,
    userAgent: req.get('User-Agent') || '',
    timestamp: new Date(),
    method: req.method,
    path: req.path,
  };
  
  next();
};

// Sanitize query parameters
export const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
  if (req.query) {
    for (const key in req.query) {
      const value = req.query[key];
      if (typeof value === 'string') {
        req.query[key] = validator.escape(value.trim());
      }
    }
  }
  
  next();
};