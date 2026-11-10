import mongoose from 'mongoose';

import BadRequestError from '../errors/bad-request-error';

/**
 * Converts database input errors into client errors and preserves other errors.
 * @param err The error raised by a database operation.
 * @returns The converted error or the original error.
 */
export default (err: unknown): unknown => {
  if (err instanceof mongoose.Error.CastError) {
    return new BadRequestError('Переданы данные некорректного типа');
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return new BadRequestError(err.message);
  }

  return err;
};
