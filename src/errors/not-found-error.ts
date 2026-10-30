import { NOT_FOUND } from './status-codes';

export default class NotFoundError extends Error {
  public readonly statusCode = NOT_FOUND;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
