import { UNAUTHORIZED } from './status-codes';

export default class UnauthorizedError extends Error {
  public readonly statusCode = UNAUTHORIZED;

  public readonly name = 'UnauthorizedError';

  constructor(message = 'Необходима авторизация') {
    super(message);
  }
}
