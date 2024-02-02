import Project from '../models/projectModel.js';
import catchAsync from '../errors/catchAsync.js';

const createProject = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { projectName } = req.body;

  const project = await Project.create({
    projectName,
    admin: user._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'project created sucessfully',
    data: {
      project,
    },
  });
});

export { createProject };
