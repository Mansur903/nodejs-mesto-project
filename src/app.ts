import { celebrate, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { PORT } from './config';
import { createUser, login } from './controllers/users';
import NotFoundError from './errors/not-found-error';
import auth from './middlewares/auth';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import router from './routes';

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
}), createUser);

app.use(auth);

app.use(router);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT);
