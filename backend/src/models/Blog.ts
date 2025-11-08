import mongoose, { Schema,Types } from 'mongoose';
import slugify from 'slugify';
import { IBlog } from '../types';

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  category: {
    type: String,
    required: true,
    enum: ['technology', 'tutorial', 'personal', 'news', 'other'],
  },
  featuredImage: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
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
  readTime: {
    type: Number,
    default: 0,
  },
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
}, {
  timestamps: true,
});

blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  if (this.isModified('content')) {
    // Calculate read time (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ published: -1, createdAt: -1 });
blogSchema.index({ tags: 1 });

export default mongoose.model<IBlog>('Blog', blogSchema);