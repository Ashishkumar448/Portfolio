import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../services/uploadService';
import {
  validateSkill,
  validatePagination,
  validateMongoId,
} from '../middleware/validation';

const router = Router();

import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController';

// Public routes
router.get('/', validatePagination, getSkills);
router.get('/:id', getSkill);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
router.post('/', upload.single('icon'), validateSkill, createSkill);
router.put('/:id', validateMongoId('id'), upload.single('icon'), updateSkill);
router.delete('/:id', validateMongoId('id'), deleteSkill);

export default router;