import { FORBIDDEN } from './status-codes';

export default class ForbiddenError extends Error {
  public readonly statusCode = FORBIDDEN;

  public readonly name = 'ForbiddenError';

  constructor(message = 'Недостаточно прав') {
    super(message);
  }
}
