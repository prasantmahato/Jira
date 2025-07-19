// models/Permission.js
import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  resource: {
    type: String,
    required: true,
    enum: ['user', 'project', 'issue', 'role', 'comment', 'attachment']
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'assign']
  }
}, {
  timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);
export default Permission;
