import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes/users';

export type RequestWithUser = Request & {
  user: { _id: string };
};

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestWithUser = req as RequestWithUser;
  requestWithUser.user = { _id: '6ae393f352e9d78113bf5f36' };

  next();
});

app.use('/', router);

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
});
