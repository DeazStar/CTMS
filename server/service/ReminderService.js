import AppError from '../errors/AppError.js';
import Redis from 'ioredis';

export default class ReminderService {
  constructor() {
    const { REDIS_PORT, REDIS_HOST, REDIS_DB } = process.env;

    this.redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      db: REDIS_DB,
    });
  }

  get(key) {
    return this.redis.get(key);
  }

  async setReminder(key, value, expire) {
    const multi = this.redis.multi();

    multi.set(key, value);
    multi.set(`reminder:${key}`, 1);
    multi.expire(`reminder:${key}`, expire);

    try {
      await multi.exec();
      console.log('Reminder set successfully');
    } catch (error) {
      throw new AppError('Error setting reminder', 500);
    }
  }
}
