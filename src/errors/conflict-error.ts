import { CONFLICT } from './status-codes';

export default class ConflictError extends Error {
  public readonly statusCode = CONFLICT;

  public readonly name = 'ConflictError';

  constructor(message = 'Конфликт данных') {
    super(message);
  }
}
