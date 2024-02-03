import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin is required for a project'],
  },
  collaborators: {
    type: [mongoose.ObjectId],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

projectSchema.pre('/^find/', async function (next) {
  await this.populate({
    path: 'admin',
    select: 'firstName lastName email',
  });

  next();
});

projectSchema.post('save', async function () {
  await this.populate({
    path: 'admin',
    select: 'firstName lastName email',
  });
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
