// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['todo', 'inProgress', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', taskSchema);
