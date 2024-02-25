import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from './routes/userRoutes.js';
import projectRoute from './routes/projectRoutes.js';
import invetationRoute from './routes/invetationRoutes.js';
import notificationRoute from './routes/notificationRoutes.js';
import generalError from './errors/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/api/v1/users', userRoute);
app.use('/api/v1/projects', projectRoute);
app.use('/api/v1/invetations', invetationRoute);
app.use('/api/v1/notifications', notificationRoute);

app.use(generalError);

export default app;
