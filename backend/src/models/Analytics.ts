import mongoose, { Schema } from 'mongoose';
import { IAnalytics } from '../types';

const analyticsSchema = new Schema<IAnalytics>({
  type: {
    type: String,
    required: true,
    enum: ['page_view', 'project_view', 'blog_view', 'download'],
  },
  resourceId: {
    type: String,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  referrer: {
    type: String,
  },
}, {
  timestamps: true,
});

analyticsSchema.index({ type: 1, createdAt: -1 });
analyticsSchema.index({ resourceId: 1, type: 1 });
analyticsSchema.index({ createdAt: -1 });

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);