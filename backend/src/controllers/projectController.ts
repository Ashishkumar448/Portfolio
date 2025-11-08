import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import Analytics from '../models/Analytics';
import { AuthRequest, PaginationQuery } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendCreated } from '../utils/response';
import uploadService from '../services/uploadService';
import { sanitizeInput } from '../utils/sanitizer';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, featured, status = 'published', search } = req.query as PaginationQuery & {
      category?: string;
      featured?: string;
      status?: string;
    };

    const filter: any = { status };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Projects retrieved successfully', projects, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: 'published'
    });

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Increment views
    project.views += 1;
    await project.save();

    // Track analytics
    await Analytics.create({
      type: 'project_view',
      resourceId: (project as any)._id.toString(),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip,
      referrer: req.get('Referer'),
    });

    sendSuccess(res, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectData: any = {
      title: sanitizeInput.string(req.body.title),
      description: sanitizeInput.html(req.body.description),
      shortDescription: sanitizeInput.string(req.body.shortDescription),
      technologies: sanitizeInput.array(req.body.technologies),
      category: sanitizeInput.string(req.body.category),
      liveUrl: sanitizeInput.url(req.body.liveUrl),
      githubUrl: sanitizeInput.url(req.body.githubUrl),
      featured: sanitizeInput.boolean(req.body.featured),
      status: sanitizeInput.string(req.body.status) || 'draft'
    };
    
    // Handle image uploads if present
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadService.uploadProjectImages(req.files as Express.Multer.File[]);
      projectData.images = imageUrls;
    }

    const project = new Project(projectData);
    await project.save();

    sendCreated(res, 'Project created successfully', project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...(req.body.title && { title: sanitizeInput.string(req.body.title) }),
      ...(req.body.description && { description: sanitizeInput.html(req.body.description) }),
      ...(req.body.shortDescription && { shortDescription: sanitizeInput.string(req.body.shortDescription) }),
      ...(req.body.technologies && { technologies: sanitizeInput.array(req.body.technologies) }),
      ...(req.body.category && { category: sanitizeInput.string(req.body.category) }),
      ...(req.body.liveUrl && { liveUrl: sanitizeInput.url(req.body.liveUrl) }),
      ...(req.body.githubUrl && { githubUrl: sanitizeInput.url(req.body.githubUrl) }),
      ...(req.body.featured !== undefined && { featured: sanitizeInput.boolean(req.body.featured) }),
      ...(req.body.status && { status: sanitizeInput.string(req.body.status) })
    };

    // Handle new image uploads
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadService.uploadProjectImages(req.files as Express.Multer.File[]);
      updateData.images = [...(updateData.images || []), ...imageUrls];
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    sendSuccess(res, 'Project updated successfully', project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const imageUrl of project.images) {
        try {
          const publicId = uploadService.extractPublicId(imageUrl);
          await uploadService.deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    await Project.findByIdAndDelete(id);

    sendSuccess(res, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const likeProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    project.likes += 1;
    await project.save();

    sendSuccess(res, 'Project liked successfully', { likes: project.likes });
  } catch (error) {
    next(error);
  }
};