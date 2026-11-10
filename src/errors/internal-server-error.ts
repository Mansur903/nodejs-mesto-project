import { INTERNAL_SERVER_ERROR } from './status-codes';

export default class InternalServerError extends Error {
  public readonly statusCode = INTERNAL_SERVER_ERROR;

  public readonly name = 'InternalServerError';

  constructor(message = 'На сервере произошла ошибка') {
    super(message);
  }
}
