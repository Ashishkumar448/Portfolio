import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import Analytics from '../models/Analytics';
import { AuthRequest, PaginationQuery } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendCreated } from '../utils/response';
import uploadService from '../services/uploadService';
import { sanitizeInput } from '../utils/sanitizer';

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, published = 'true', search } = req.query as PaginationQuery & {
      category?: string;
      published?: string;
    };

    const filter: any = { published: published === 'true' };
    
    if (category) filter.category = sanitizeInput.string(category);
    if (search) {
      filter.$text = { $search: sanitizeInput.string(search) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Blogs retrieved successfully', blogs, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findOne({
      $or: [{ _id: id }, { slug: id }],
      published: true
    }).populate('author', 'name avatar');

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    // Track analytics
    await Analytics.create({
      type: 'blog_view',
      resourceId: (blog as any)._id.toString(),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip,
      referrer: req.get('Referer'),
    });

    sendSuccess(res, 'Blog retrieved successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const blogData: any = {
      title: sanitizeInput.string(req.body.title),
      content: sanitizeInput.html(req.body.content),
      excerpt: sanitizeInput.string(req.body.excerpt),
      author: authReq.user!._id,
      tags: sanitizeInput.array(req.body.tags),
      category: sanitizeInput.string(req.body.category),
      published: sanitizeInput.boolean(req.body.published),
      seoTitle: sanitizeInput.string(req.body.seoTitle),
      seoDescription: sanitizeInput.string(req.body.seoDescription)
    };
    
    // Handle featured image upload
    if (req.file) {
      blogData.featuredImage = await uploadService.uploadBlogImage(req.file);
    }

    const blog = new Blog(blogData);
    await blog.save();

    sendCreated(res, 'Blog created successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...(req.body.title && { title: sanitizeInput.string(req.body.title) }),
      ...(req.body.content && { content: sanitizeInput.html(req.body.content) }),
      ...(req.body.excerpt && { excerpt: sanitizeInput.string(req.body.excerpt) }),
      ...(req.body.tags && { tags: sanitizeInput.array(req.body.tags) }),
      ...(req.body.category && { category: sanitizeInput.string(req.body.category) }),
      ...(req.body.published !== undefined && { published: sanitizeInput.boolean(req.body.published) }),
      ...(req.body.seoTitle && { seoTitle: sanitizeInput.string(req.body.seoTitle) }),
      ...(req.body.seoDescription && { seoDescription: sanitizeInput.string(req.body.seoDescription) })
    };

    // Handle new featured image
    if (req.file) {
      updateData.featuredImage = await uploadService.uploadBlogImage(req.file);
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    sendSuccess(res, 'Blog updated successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage) {
      try {
        const publicId = uploadService.extractPublicId(blog.featuredImage);
        await uploadService.deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await Blog.findByIdAndDelete(id);

    sendSuccess(res, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    blog.likes += 1;
    await blog.save();

    sendSuccess(res, 'Blog liked successfully', { likes: blog.likes });
  } catch (error) {
    next(error);
  }
};