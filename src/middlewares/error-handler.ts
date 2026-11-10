import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import ForbiddenError from '../errors/forbidden-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import { INTERNAL_SERVER_ERROR } from '../errors/status-codes';
import UnauthorizedError from '../errors/unauthorized-error';

export default (
  err: Error & { code?: number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const internalServerError = new InternalServerError();
  let error: Error & { readonly statusCode: number } = internalServerError;

  if (
    err instanceof BadRequestError
    || err instanceof UnauthorizedError
    || err instanceof ForbiddenError
    || err instanceof NotFoundError
    || err instanceof ConflictError
    || err instanceof InternalServerError
  ) {
    error = err;
  } else if (err.code === 11000) {
    error = new ConflictError('Пользователь с таким email уже существует');
  } else if (err instanceof mongoose.Error.CastError) {
    error = new BadRequestError('Переданы данные некорректного типа');
  } else if (isCelebrateError(err) || err instanceof mongoose.Error.ValidationError) {
    error = new BadRequestError(err.message);
  } else if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    error = new BadRequestError(err.message);
  }

  return res.status(error.statusCode).send({
    message: error.statusCode === INTERNAL_SERVER_ERROR
      ? internalServerError.message
      : error.message,
  });
};
