import { Request } from 'express';
import { Document,Types } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  provider: 'local' | 'google' | 'github';
  providerId?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProject extends Document {
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'draft' | 'published';
  slug: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt: string;
  author: Types.ObjectId | IUser['_id'];
  tags: string[];
  category: string;
  featuredImage?: string;
  published: boolean;
  slug: string;
  views: number;
  likes: number;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill extends Document {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  proficiency: number;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  blog: IBlog['_id'];
  parentComment?: IComment['_id'];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalytics extends Document {
  type: 'page_view' | 'project_view' | 'blog_view' | 'download';
  resourceId?: string;
  userAgent: string;
  ip: string;
  country?: string;
  city?: string;
  referrer?: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}