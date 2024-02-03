import Project from '../models/projectModel.js';
import AppError from '../errors/AppError.js';
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

const listProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  const project = await Project.find({ admin: user._id }).populate({
    path: 'admin',
    select: 'fistName lastName email',
  });

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

const editProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { projectName } = req.body;

  let project = await Project.findById(req.params.id);

  if (user._id.toString() !== project.admin.toString())
    return next(
      new AppError('Only admin of the project can edit the project', 403),
    );

  project = await Project.findByIdAndUpdate(req.params.id, {
    projectName,
    updatedAt: new Date(),
  }).populate({ path: 'admin', select: 'firstName lastName email' });

  res.status(200).json({
    status: 'success',
    message: 'project updated sucessfully',
    data: {
      project,
    },
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  let project = await Project.findById(req.params.id);

  if (user._id.toString() !== project.admin.toString())
    return next(
      new AppError('Only admin of the project can delete the project', 403),
    );

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'project deleted sucessfully',
    data: null,
  });
});

export { createProject, listProject, editProject, deleteProject };
