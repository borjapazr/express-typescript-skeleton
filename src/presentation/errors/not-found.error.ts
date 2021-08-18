import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';

import { ApiError } from './api.error';

class NotFoundError extends ApiError {
  constructor(method: string, path: string) {
    super(
      StatusCodes.NOT_FOUND,
      'not_found',
      `${emoji.get('cry')} Can't find ${method.toUpperCase()} ${path} on this server.`
    );
  }
}

export { NotFoundError };
