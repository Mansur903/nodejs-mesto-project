import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import { INTERNAL_SERVER_ERROR } from '../errors/status-codes';

export default (
  err: Error & { readonly statusCode?: number; readonly type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = err;

  if (isCelebrateError(err)) {
    error = new BadRequestError(err.message);
  } else if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    error = new BadRequestError('Передан некорректный JSON');
  }

  const { statusCode = INTERNAL_SERVER_ERROR, message } = error;

  return res.status(statusCode).send({
    message: statusCode >= INTERNAL_SERVER_ERROR
      ? new InternalServerError().message
      : message,
  });
};
