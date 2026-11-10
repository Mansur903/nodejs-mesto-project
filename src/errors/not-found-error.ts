import { NOT_FOUND } from './status-codes';

export default class NotFoundError extends Error {
  public readonly statusCode = NOT_FOUND;

  public readonly name = 'NotFoundError';

  constructor(message = 'Ресурс не найден') {
    super(message);
  }
}
