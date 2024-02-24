import ReminderService from './ReminderService.js';
import Subscribe from './Subscriber.js';

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
        const taskId = reminderService.get(taskId);
        console.log('sending email');
        //TODO:
      }
    }
  });

  reminder.onError();
}
