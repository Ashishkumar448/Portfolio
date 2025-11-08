import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import Blog from '../models/Blog';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendCreated } from '../utils/response';
import { sanitizeInput } from '../utils/sanitizer';

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [comments, total] = await Promise.all([
      Comment.find({ blog: blogId, approved: true, parentComment: null })
        .populate({
          path: 'replies',
          match: { approved: true },
          options: { sort: { createdAt: 1 } }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Comment.countDocuments({ blog: blogId, approved: true, parentComment: null }),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Comments retrieved successfully', comments, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { blogId } = req.params;
    
    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    const commentData = {
      content: sanitizeInput.string(req.body.content),
      author: {
        name: sanitizeInput.string(req.body.author.name),
        email: sanitizeInput.email(req.body.author.email),
        avatar: req.body.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.author.name)}&background=random`
      },
      blog: blogId,
      parentComment: req.body.parentComment ? sanitizeInput.string(req.body.parentComment) : undefined,
      approved: false // Require admin approval
    };

    const comment = new Comment(commentData);
    await comment.save();

    sendCreated(res, 'Comment submitted for approval', comment);
  } catch (error) {
    next(error);
  }
};

export const approveComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    sendSuccess(res, 'Comment approved successfully', comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: id });

    sendSuccess(res, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};