// models/Role.js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Admin', 'Project Manager', 'Developer', 'Tester', 'Viewer']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isSystemRole: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
