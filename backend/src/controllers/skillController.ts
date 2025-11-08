import { Request, Response, NextFunction } from 'express';
import Skill from '../models/Skill';
import { AuthRequest, PaginationQuery } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendCreated } from '../utils/response';
import uploadService from '../services/uploadService';
import { sanitizeInput } from '../utils/sanitizer';

export const getSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50, category, featured } = req.query as PaginationQuery & {
      category?: string;
      featured?: string;
    };

    const filter: any = {};
    
    if (category) filter.category = sanitizeInput.string(category);
    if (featured === 'true') filter.featured = true;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [skills, total] = await Promise.all([
      Skill.find(filter)
        .sort({ featured: -1, proficiency: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Skill.countDocuments(filter),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Skills retrieved successfully', skills, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findById(id);
    if (!skill) {
      return next(new AppError('Skill not found', 404));
    }

    sendSuccess(res, 'Skill retrieved successfully', skill);
  } catch (error) {
    next(error);
  }
};

import { ISkill } from '../types';

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ Explicitly type it as Partial<ISkill>
    const skillData: Partial<ISkill> = {
      name: sanitizeInput.string(req.body.name),
      category: sanitizeInput.string(req.body.category) as ISkill['category'],
      proficiency: sanitizeInput.number(req.body.proficiency),
      yearsOfExperience: sanitizeInput.number(req.body.yearsOfExperience),
      description: sanitizeInput.string(req.body.description),
      featured: sanitizeInput.boolean(req.body.featured),
    };
    
    // ✅ Now TypeScript knows icon is allowed
    if (req.file) {
      skillData.icon = await uploadService.uploadSkillIcon(req.file);
    }

    const skill = new Skill(skillData);
    await skill.save();

    sendCreated(res, 'Skill created successfully', skill);
  } catch (error) {
    next(error);
  }
};


export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...(req.body.name && { name: sanitizeInput.string(req.body.name) }),
      ...(req.body.category && { category: sanitizeInput.string(req.body.category) }),
      ...(req.body.proficiency !== undefined && { proficiency: sanitizeInput.number(req.body.proficiency) }),
      ...(req.body.yearsOfExperience !== undefined && { yearsOfExperience: sanitizeInput.number(req.body.yearsOfExperience) }),
      ...(req.body.description && { description: sanitizeInput.string(req.body.description) }),
      ...(req.body.featured !== undefined && { featured: sanitizeInput.boolean(req.body.featured) })
    };

    // Handle new icon upload
    if (req.file) {
      updateData.icon = await uploadService.uploadSkillIcon(req.file);
    }

    const skill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return next(new AppError('Skill not found', 404));
    }

    sendSuccess(res, 'Skill updated successfully', skill);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return next(new AppError('Skill not found', 404));
    }

    // Delete icon from Cloudinary
    if (skill.icon) {
      try {
        const publicId = uploadService.extractPublicId(skill.icon);
        await uploadService.deleteFromCloudinary(publicId);
      } catch (error) {
        console.error('Error deleting icon:', error);
      }
    }

    await Skill.findByIdAndDelete(id);

    sendSuccess(res, 'Skill deleted successfully');
  } catch (error) {
    next(error);
  }
};