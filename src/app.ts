import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
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
app.use((
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
) => {
  const { statusCode = 500, message } = err;

  return res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
});
