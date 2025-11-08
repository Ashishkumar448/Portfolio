import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../services/uploadService';
import { uploadLimiter } from '../middleware/rateLimiter';
import { validateFileUpload } from '../middleware/sanitization';

const router = Router();

import {
  uploadSingle,
  uploadMultiple,
  deleteFile,
} from '../controllers/uploadController';

// Protected routes (admin only)
router.use(authenticate, authorize('admin'), uploadLimiter, validateFileUpload);

router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.delete('/:publicId', deleteFile);

export default router;