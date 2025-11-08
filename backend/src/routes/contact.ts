import { Router } from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';
import { contactLimiter } from '../middleware/rateLimiter';
import {
  validateContact,
  validatePagination,
  validateMongoId,
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/', contactLimiter, validateContact, submitContact);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
router.get('/', validatePagination, getContacts);
router.get('/:id', validateMongoId('id'), getContact);
router.patch('/:id/status', validateMongoId('id'), updateContactStatus);
router.delete('/:id', validateMongoId('id'), deleteContact);

export default router;