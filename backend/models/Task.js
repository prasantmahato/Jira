// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'inprogress', 'review', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  description: String,
  assignee: String,
  reporter: String,
  labels: [String],
  order: Number,
  comments: [{ text: String, time: Date }],
  sprintNo: String,
  projectNo: String,
  acceptanceCriteria: String,
  taskType: { type: String, enum: ['Bug', 'Spike', 'Ticket'] },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
