import mongoose, { Schema } from 'mongoose';
import { IContact } from '../types';

const contactSchema = new Schema<IContact>({
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
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
  },
}, {
  timestamps: true,
});

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export default mongoose.model<IContact>('Contact', contactSchema);