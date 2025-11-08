import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../services/uploadService';
import {
  validateBlog,
  validatePagination,
  validateMongoId,
} from '../middleware/validation';

const router = Router();

import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from '../controllers/blogController';

// Public routes
router.get('/', validatePagination, getBlogs);
router.get('/:id', getBlog);
router.post('/:id/like', likeBlog);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
router.post('/', upload.single('featuredImage'), validateBlog, createBlog);
router.put('/:id', validateMongoId('id'), upload.single('featuredImage'), updateBlog);
router.delete('/:id', validateMongoId('id'), deleteBlog);

export default router;