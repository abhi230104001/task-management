const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
  originalName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    attachments: [documentSchema],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Task', taskSchema);
