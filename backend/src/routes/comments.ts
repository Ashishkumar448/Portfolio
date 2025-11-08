import { Router } from 'express';
import {
  getComments,
  createComment,
  approveComment,
  deleteComment,
} from '../controllers/commentController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateComment,
  validatePagination,
  validateMongoId,
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/blog/:blogId', validateMongoId('blogId'), validatePagination, getComments);
router.post('/blog/:blogId', validateMongoId('blogId'), validateComment, createComment);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
router.patch('/:id/approve', validateMongoId('id'), approveComment);
router.delete('/:id', validateMongoId('id'), deleteComment);

export default router;