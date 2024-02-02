import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoute from './routes/userRoutes.js';
import projectRoute from './routes/projectRoutes.js';
import generalError from './errors/errorHandler.js';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/projects', projectRoute);

app.use(generalError);

export default app;
