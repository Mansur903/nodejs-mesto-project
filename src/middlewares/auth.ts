import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import StatusCodeError from '../errors/status-code-error';
import { UNAUTHORIZED } from '../errors/status-codes';

export default (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new StatusCodeError(UNAUTHORIZED, 'Необходима авторизация'));
  }

  let payload: jwt.JwtPayload | string;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    return next(new StatusCodeError(UNAUTHORIZED, 'Неверный токен'));
  }

  if (typeof payload === 'string' || typeof payload._id !== 'string') {
    return next(new StatusCodeError(UNAUTHORIZED, 'Неверный токен'));
  }

  req.user = { _id: payload._id };
  return next();
};
