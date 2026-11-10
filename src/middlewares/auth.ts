import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UnauthorizedError from '../errors/unauthorized-error';

export default (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new UnauthorizedError());
  }

  let payload: jwt.JwtPayload | string;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    return next(new UnauthorizedError('Неверный токен'));
  }

  if (typeof payload === 'string' || typeof payload._id !== 'string') {
    return next(new UnauthorizedError('Неверный токен'));
  }

  req.user = { _id: payload._id };
  return next();
};
