import Task from '../models/taskModel.js';
import UserProject from '../models/userProjectModel.js';
import UserTask from '../models/userTaskModel.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';

const checkUserRole = async (userId, projectId) => {
  let userProject;
  try {
    userProject = await UserProject.findOne({
      user: userId,
      project: projectId,
    });
  } catch (err) {
    throw err;
  }
  if (!userProject) return false;

  if (userProject.role === 'admin' || userProject.role === 'manager')
    return true;

  return false;
};

const createTask = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { taskName, taskDescription, dueDate } = req.body;
  const { projectId } = req.params;

  // add do date TODO
  const isAllowed = await checkUserRole(user._id, projectId);

  if (!isAllowed)
    return next(new AppError('Only Admins and Managers can create tasks', 401));

  const task = await Task.create({
    project: projectId,
    taskName,
    taskDescription,
    dueDate,
  });

  const taskFiltred = task.toObject();

  delete taskFiltred.__v;

  res.status(201).json({
    status: 'success',
    message: 'task created sucessfully',
    data: {
      tasks: taskFiltred,
    },
  });
});

const listTask = catchAsync(async (req, res, next) => {
  //const user = req.user;
  const { projectId } = req.params;

  // retrive the assigned tasks as well TODO
  const tasks = await Task.find({ project: projectId }).select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      tasks,
    },
  });
});

const getTaskById = catchAsync(async (req, res, next) => {
  //retrive assigned tasks as well TODO
  const { taskId } = req.params;

  const task = await Task.findById(taskId).select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

const editTask = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { taskId, projectId } = req.params;
  const { taskName, taskDescription, dueDate } = req.body;

  const isAllowed = await checkUserRole(user._id, projectId);

  if (!isAllowed)
    return next(new AppError('Only Admins and Managers can edit a task', 401));

  let task = await Task.findById(taskId);

  if (!task) return next(new AppError('Task not found', 404));

  // do due date TODO

  task.taskName = taskName;
  task.taskDescription = taskDescription;
  task.dueDate = dueDate;
  task.updatedAt = new Date();

  task = await Task.findByIdAndUpdate(task._id, task);

  const taskFiltered = task.toObject();

  delete taskFiltered.__v;

  res.status(200).json({
    status: 'success',
    message: 'task updated sucessfully',
    data: {
      tasks: taskFiltered,
    },
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { taskId, projectId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) return next(new AppError('Task not found', 404));

  const isAllowed = await checkUserRole(user._id, projectId);

  if (!isAllowed)
    return next(new AppError('Only Admin and Managers can delete tasks', 401));

  await Task.findByIdAndDelete(taskId);

  // delte all assigned tasks from UserTask Model //TODO

  res.status(200).json({
    status: 'success',
    message: 'task deleted sucessfully',
    data: null,
  });
});

const assignTask = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { taskId, projectId } = req.params;
  const { assignedUserId } = req.body;

  const isAllowed = await checkUserRole(user._id, projectId);

  if (!isAllowed)
    return next(new AppError('Only Admin and Managers can assign tasks', 401));

  const task = await UserTask.findOne({
    user: assignedUserId,
    task: taskId,
  });

  if (task) {
    await UserTask.findByIdAndDelete(task._id);

    res.status(200).json({
      status: 'success',
      message: 'User is removed from this task',
    });
  } else {
    await UserTask.create({
      user: assignedUserId,
      task: taskId,
    });

    res.status(200).json({
      status: 'success',
      message: 'User assigned to this task',
    });
  }
});

export { createTask, listTask, editTask, deleteTask, getTaskById, assignTask };
