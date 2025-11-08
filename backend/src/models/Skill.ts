import mongoose, { Schema } from 'mongoose';
import { ISkill } from '../types';

const skillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'tools', 'other'],
  },
  proficiency: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  icon: {
    type: String,
  },
  description: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

skillSchema.index({ category: 1, proficiency: -1 });
skillSchema.index({ featured: -1, proficiency: -1 });

export default mongoose.model<ISkill>('Skill', skillSchema);