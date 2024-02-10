import mongoose from 'mongoose';

const userProjectSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: [true, 'Project is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'team_memeber'],
  },
});

userProjectSchema.post('save', async function () {
  await this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });

  await this.populate({
    path: 'project',
    select: '-__v',
  });
});

const userProjectModel = mongoose.model('UserProject', userProjectSchema);

export default userProjectModel;
