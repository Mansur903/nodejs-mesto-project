import { celebrate, isCelebrateError, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { createUser, login } from './controllers/users';
import StatusCodeError from './errors/status-code-error';
import {
  BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND,
} from './errors/status-codes';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import router from './routes';

const { PORT = 3000 } = process.env;
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

app.use(errorLogger);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new StatusCodeError(NOT_FOUND, 'Маршрут не найден'));
});
app.use((
  err: Error & { statusCode?: number; code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isBadRequest = isCelebrateError(err)
    || err instanceof mongoose.Error.ValidationError
    || err instanceof mongoose.Error.CastError;
  const isConflict = err.code === 11000;

  let statusCode = err.statusCode ?? (isBadRequest ? BAD_REQUEST : INTERNAL_SERVER_ERROR);
  if (isConflict) {
    statusCode = CONFLICT;
  }
  let { message } = err;
  if (isConflict) {
    message = 'Пользователь с таким email уже существует';
  } else if (err instanceof mongoose.Error.CastError) {
    message = 'Переданы данные некорректного типа';
  }

  return res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT);
