import { BAD_REQUEST } from './status-codes';

export default class BadRequestError extends Error {
  public readonly statusCode = BAD_REQUEST;

  public readonly name = 'BadRequestError';

  constructor(message = 'Переданы некорректные данные') {
    super(message);
  }
}
