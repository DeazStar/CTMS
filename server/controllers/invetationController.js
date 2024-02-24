import jwt from 'jsonwebtoken';
import Project from '../models/projectModel.js';
import Invetation from '../models/invetationModel.js';
import UserProject from '../models/userProjectModel.js';
import Email from '../utils/Email.js';
import AppError from '../errors/AppError.js';
import catchAsync from '../errors/catchAsync.js';

const sendInvetation = catchAsync(async (req, res, next) => {
  let url;
  const user = req.user;
  const { email } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new AppError('This project does not exist', 404));
  }

  const userProject = await UserProject.findOne({
    project: project._id,
    user: user._id,
  });

  console.log(userProject.role);

  if (userProject.role !== 'admin' && userProject.role !== 'manager')
    return next(
      new AppError(
        'Only admins and managers can invite user to this project',
        401,
      ),
    );

  const token = jwt.sign({ projectId: project._id }, process.env.JWT_SECRET);

  if (process.env.NODE_ENV === 'dev') {
    url = `http://localhost:${process.env.PORT}/invetation/${token}`;
  } else {
    //TODO
  }

  const invetationEmail = new Email({ to: email, url: url });

  await invetationEmail.sendInvetation(user.email, project.projectName);

  const invetation = await Invetation.findOne({
    invitee: email,
    project: project._id,
  });

  if (invetation) {
    res.status(200).json({
      status: 'success',
      message: 'Invetation have been resent',
    });

    return;
  }

  await Invetation.create({
    inviter: user._id,
    invitee: email,
    project: project._id,
    invetationStatus: 'sent',
  });

  res.status(200).json({
    status: 'successfull',
    message: 'Invetation sent!',
  });
});

const acceptInvetation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { invetationToken } = req.params;
  let projectId;

  try {
    const project = jwt.verify(invetationToken, process.env.JWT_SECRET);
    projectId = project.projectId;
  } catch (err) {
    return next(new AppError('invalid token', 401));
  }

  if (!projectId) return next(new AppError('invalid token', 401));

  const invetationStat = await Invetation.findOneAndUpdate(
    { invitee: user.email, project: projectId },
    { invetationStatus: 'accepted' },
  );

  if (!invetationStat)
    return next(new AppError(404, 'This person was not invited'));

  await UserProject.create({
    user: user._id,
    role: 'team_memeber',
    project: projectId,
  });

  res.status(200).json({
    status: 'success',
    message: `${user.email} is added to the project`,
  });
});

export { sendInvetation, acceptInvetation };
