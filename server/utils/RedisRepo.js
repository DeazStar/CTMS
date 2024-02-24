import Redis from 'ioredis';

export default class RedisRepo {
  constructor(port, host, db) {
    this.redis = new Redis({ port: port, host: host, db: db });
    this.redis.on('ready', () => {
      this.redis.config('SET', 'notify-keyspace-events', 'KExe');
      console.log('Finish configuring redis');
    });
  }
}
