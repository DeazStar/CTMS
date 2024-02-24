import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';

import RedisRepo from './utils/RedisRepo.js';
import RedisExpiredEvents from './service/RedisExpiredEvents.js';

dotenv.config();

const { PORT, DATABASE_URL, REDIS_HOST, REDIS_PORT, REDIS_DB } = process.env;

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION!!!...Shuting Down...');
  console.error(error);
  process.exit(1);
});

const redis = new RedisRepo(Number(REDIS_PORT), REDIS_HOST, Number(REDIS_DB));
RedisExpiredEvents();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${PORT}`);
});

mongoose
  .connect(DATABASE_URL)
  .then((data) => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION!!!...Shuting Down...');
  console.error(reason);
  process.exit(1);
});

export default redis;
