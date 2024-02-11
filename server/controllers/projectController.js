import Project from '../models/projectModel.js';
import UserProject from '../models/userProjectModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';

const createProject = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { projectName } = req.body;

  const project = await Project.create({
    projectName,
  });

  const userProject = await UserProject.create({
    user: user._id,
    project: project._id,
    role: 'admin',
  });

  const userProjectFiltred = userProject.toObject();

  delete userProjectFiltred.__v;

  res.status(201).json({
    status: 'success',
    message: 'project created sucessfully',
    data: {
      userProjectFiltred,
    },
  });
});

const listProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  const userProject = await UserProject.find({ user: user._id })
    .select('-__v')
    .populate({
      path: 'user',
      select: 'firstName lastName email',
    })
    .populate({
      path: 'project',
      select: '-__v',
    });

  res.status(200).json({
    status: 'success',
    data: {
      userProject,
    },
  });
});

const editProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { projectName } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) return next(new AppError('Project not found', 404));

  const userProject = await UserProject.findOne({
    project: req.params.id,
    user: user._id,
  });

  if (userProject.role !== 'admin')
    return next(
      new AppError('Only admin of the project can edit the project', 403),
    );

  project.projectName = projectName;
  project.updatedAt = new Date();

  project.save();

  const projectFiltered = project.toObject();

  delete projectFiltered.__v;

  res.status(200).json({
    status: 'success',
    message: 'project updated sucessfully',
    data: {
      projectFiltered,
    },
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  const project = await Project.findById(req.params.id);

  if (!project) return next(new AppError('Project not found', 404));

  const userProject = await UserProject.findOne({
    project: project._id,
    user: user._id,
  });

  if (userProject.role !== 'admin')
    return next(
      new AppError('Only admin of the project can delete the project', 403),
    );

  await Project.findByIdAndDelete(req.params.id);

  await UserProject.deleteMany({ project: project._id });

  res.status(200).json({
    status: 'success',
    message: 'project deleted sucessfully',
    data: null,
  });
});

export { createProject, listProject, editProject, deleteProject };
