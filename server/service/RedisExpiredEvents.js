import Subscribe from './Subscriber.js';

export default function RedisExpiredEvents() {
  const { REDIS_DB } = process.env;
  const reminder = new Subscribe();

  reminder.subscribe(`__keyevent@${REDIS_DB}__:expired`);
  console.log('Subscribe to an event');

  reminder.listen('message', async (channel, message) => {
    const [type, key] = message.split(':');
    console.log('sdkfjlkdsfjdksf');
    switch (type) {
      case 'reminder': {
        const taskId = await reminder.get(key);
        console.log('sending email');
        //TODO:
      }
    }
  });

  reminder.onError();
}
