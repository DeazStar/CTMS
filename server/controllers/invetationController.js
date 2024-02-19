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

  if (userProject.role !== 'admin' || userProject.role !== 'manager')
    return next(
      new App('Only admins and managers can invite user to this project', 401),
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
      status: 'successful',
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

export { sendInvetation };
