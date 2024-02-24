import Redis from 'ioredis';

export default class Subscribe {
  constructor() {
    const { REDIS_PORT, REDIS_HOST, REDIS_DB } = process.env;

    this.subscriber = new Redis({
      port: Number(REDIS_PORT),
      host: REDIS_HOST,
      db: Number(REDIS_DB),
    });

    console.log('Subscriber created');

    this.subscriber.on('connect', () => {
      console.log('Subscriber connected');
    });

    this.subscriber.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }
  subscribe(channel) {
    this.subscriber.subscribe(channel);

    this.subscriber.on('subscribe', (confirmedChannel, count) => {
      console.log(
        `Subscribed to channel: ${confirmedChannel}. Total subscriptions: ${count}`,
      );
    });
  }

  listen(event, callback) {
    this.subscriber.on(event, (channel, message) => {
      callback(channel, message);
    });
  }

  onError() {
    this.subscriber.on('error', (error) => {
      console.log(error);
    });
  }
}
