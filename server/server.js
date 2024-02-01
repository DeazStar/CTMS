import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const { PORT, DATABASE_URL } = process.env;

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION!!!...Shuting Down...');
  console.error(error);
  process.exit(1);
});

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
