// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  key: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z]{2,10}$/,
    maxlength: 10
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['software', 'marketing', 'design', 'operations', 'research'],
    default: 'software'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowExternalUsers: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false },
    defaultAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ key: 1, status: 1 });
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for member count
projectSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.length : 0;
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
