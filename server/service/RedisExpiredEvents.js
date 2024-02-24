import Email from '../utils/Email.js';
import ReminderService from './ReminderService.js';
import Subscribe from './Subscriber.js';
import UserTask from '../models/userTaskModel.js';
import Task from '../models/taskModel.js';
import Notification from '../models/notificationModel.js';

export default function RedisExpiredEvents() {
  const { REDIS_DB } = process.env;
  const reminder = new Subscribe();
  const reminderService = new ReminderService();

  reminder.subscribe(`__keyevent@${REDIS_DB}__:expired`);
  console.log('Subscribe to an event');

  reminder.listen('message', async (channel, message) => {
    const [type, key] = message.split(':');
    console.log('sdkfjlkdsfjdksf');
    switch (type) {
      case 'reminder': {
        const taskId = await reminderService.get(key);
        console.log('sending email');
        try {
          console.log(taskId);
          const task = await Task.findById(taskId);

          if (!task) return;
          await Notification.create({
            project: task.project,
            content: `Reminder for ${task.taskName}`,
            isRead: false,
          });

          const userTask = await UserTask.find({ task: taskId })
            .select('user')
            .populate({
              path: 'user',
              select: 'email',
            });
          const emails = userTask.map((obj) => obj.user.email);
          const url = 'http://localhost:3000/';

          console.log(emails);

          const email = new Email({ to: emails[0], url });

          await email.sendReminder(task.taskName);
        } catch (err) {
          console.log(err);
          return;
        }
      }
    }
  });

  reminder.onError();
}
