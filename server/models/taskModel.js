import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required'],
  },
  taskName: {
    type: String,
    required: [true, 'Task name is required'],
  },
  taskDescription: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: [true, 'Created date is required'],
  },
  updatedAt: {
    type: Date,
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
