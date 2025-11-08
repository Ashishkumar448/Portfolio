import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh-token', refreshToken);

// OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuth, googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubAuth, githubCallback);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;