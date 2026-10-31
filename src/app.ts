import { isCelebrateError } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import NotFoundError from './errors/not-found-error';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from './errors/status-codes';
import router from './routes';

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '6ae393f352e9d78113bf5f36' };

  next();
});

app.use(router);
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use((
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isBadRequest = isCelebrateError(err)
    || err instanceof mongoose.Error.ValidationError
    || err instanceof mongoose.Error.CastError;

  const statusCode = err.statusCode
    ?? (isBadRequest ? BAD_REQUEST : INTERNAL_SERVER_ERROR);
  let { message } = err;
  if (err instanceof mongoose.Error.CastError) {
    message = 'Переданы данные некорректного типа';
  }

  return res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT);
