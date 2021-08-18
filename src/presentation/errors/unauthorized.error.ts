import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';

import { ApiError } from './api.error';

class UnauthorizedError extends ApiError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'unauthorized', `${emoji.get('no_entry_sign')} Missing or invalid token.`);
  }
}

export { UnauthorizedError };
