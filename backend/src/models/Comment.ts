import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  author: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

commentSchema.index({ blog: 1, approved: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

export default mongoose.model<IComment>('Comment', commentSchema);