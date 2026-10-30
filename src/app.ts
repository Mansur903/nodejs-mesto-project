import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import NotFoundError from './errors/not-found-error';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from './errors/status-codes';
import cardsRouter from './routes/cards';
import usersRouter from './routes/users';
import type { RequestWithUser } from './types';

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestWithUser = req as RequestWithUser;
  requestWithUser.user = { _id: '6ae393f352e9d78113bf5f36' };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errors());
app.use((
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) => {
  const statusCode = err.statusCode
    ?? (err instanceof mongoose.Error.ValidationError
      || err instanceof mongoose.Error.CastError ? BAD_REQUEST : INTERNAL_SERVER_ERROR);

  return res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message,
  });
});

app.listen(PORT);
