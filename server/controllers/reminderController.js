import AppError from '../errors/AppError.js';
import ReminderService from '../service/ReminderService.js';
import catchAsync from '../errors/catchAsync.js';
import Notification from '../models/notificationModel.js';

const setReminder = async (date, data) => {
  const providedSecond = Math.floor(date.getTime() / 1000);

  const currentSecond = Math.floor(Date.now() / 1000);

  const expire = providedSecond - currentSecond;

  if (expire < 0) {
    throw new AppError('The provided date is in the past', 400);
  }

  const reminder = new ReminderService();

  await reminder.setReminder(data, data, expire);

  return true;
};

const getAllNotification = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const notifications = await Notification.find({ project: projectId }).select(
    '-__v',
  );

  res.status(200).json({
    status: 'success',
    data: {
      notifications,
    },
  });
});

const getUnreadNotification = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const notifications = await Notification.find({
    project: projectId,
    isRead: false,
  }).select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      notifications,
    },
  });
});

const readAllNotification = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  await Notification.updateMany({ project: projectId }, { isRead: true });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

const readSingleNotification = catchAsync(async (req, res, next) => {
  const { notificationId } = req.params;

  await Notification.findByIdAndUpdate(notificationId, { isRead: true });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

export {
  setReminder,
  getAllNotification,
  getUnreadNotification,
  readAllNotification,
  readSingleNotification,
};
