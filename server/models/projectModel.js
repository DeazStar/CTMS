import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
