import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validatePagination } from '../middleware/validation';

const router = Router();

import {
  getAnalytics,
  getDashboardStats,
  trackEvent,
} from '../controllers/analyticsController';

// Public routes
router.post('/track', trackEvent);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
router.get('/', validatePagination, getAnalytics);
router.get('/dashboard', getDashboardStats);

export default router;