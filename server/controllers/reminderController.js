import AppError from '../errors/AppError.js';
import ReminderService from '../service/ReminderService.js';

export const setReminder = async (date, data) => {
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
