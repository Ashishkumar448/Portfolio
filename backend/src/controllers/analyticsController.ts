import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';
import { sanitizeInput } from '../utils/sanitizer';

export const trackEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventData = {
      type: sanitizeInput.string(req.body.type),
      resourceId: sanitizeInput.string(req.body.resourceId),
      userAgent: req.get('User-Agent') || '',
      ip: req.ip,
      referrer: req.get('Referer') || '',
    };

    await Analytics.create(eventData);
    sendSuccess(res, 'Event tracked successfully');
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const type = req.query.type as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const filter: any = {};
    if (type) filter.type = sanitizeInput.string(type);
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(sanitizeInput.string(startDate));
      if (endDate) filter.createdAt.$lte = new Date(sanitizeInput.string(endDate));
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [analytics, total] = await Promise.all([
      Analytics.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Analytics.countDocuments(filter),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Analytics retrieved successfully', analytics, 200, pagination);
  } catch (error) {
    next(error);
  }
};


export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalViews,
      projectViews,
      blogViews,
      recentViews,
      topProjects,
      topBlogs
    ] = await Promise.all([
      Analytics.countDocuments(),
      Analytics.countDocuments({ type: 'project_view' }),
      Analytics.countDocuments({ type: 'blog_view' }),
      Analytics.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Analytics.aggregate([
        { $match: { type: 'project_view' } },
        { $group: { _id: '$resourceId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Analytics.aggregate([
        { $match: { type: 'blog_view' } },
        { $group: { _id: '$resourceId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const stats = {
      totalViews,
      projectViews,
      blogViews,
      recentViews,
      topProjects,
      topBlogs
    };

    sendSuccess(res, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};