import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IProject } from '../types';

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200,
  },
  technologies: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'api', 'other'],
  },
  images: [{
    type: String,
  }],
  liveUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  slug: {
    type: String,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model<IProject>('Project', projectSchema);