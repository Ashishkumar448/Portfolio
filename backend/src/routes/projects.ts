import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
} from '../controllers/projectController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { upload } from '../services/uploadService';
import {
  validateProject,
  validatePagination,
  validateMongoId,
} from '../middleware/validation';
import { validateFileUpload } from '../middleware/sanitization';

const router = Router();

// Public routes
router.get('/', validatePagination, getProjects);
router.get('/:id', getProject);
router.post('/:id/like', likeProject);

// Protected routes (admin only)
router.use(authenticate, authorize('admin'));
// Middleware to parse JSON strings in FormData
const parseFormData = (req: any, res: any, next: any) => {
  if (req.body.technologies && typeof req.body.technologies === 'string') {
    try {
      req.body.technologies = JSON.parse(req.body.technologies);
    } catch (e) {
      req.body.technologies = [];
    }
  }
  // Convert string booleans
  if (req.body.featured === 'true') req.body.featured = true;
  if (req.body.featured === 'false') req.body.featured = false;
  
  // Trim URLs
  if (req.body.liveUrl) req.body.liveUrl = req.body.liveUrl.trim();
  if (req.body.githubUrl) req.body.githubUrl = req.body.githubUrl.trim();
  
  next();
};

router.post('/', upload.array('images', 5), validateFileUpload, parseFormData, validateProject, createProject);
router.put('/:id', validateMongoId('id'), upload.array('images', 5), validateFileUpload, updateProject);
router.delete('/:id', validateMongoId('id'), deleteProject);

export default router;