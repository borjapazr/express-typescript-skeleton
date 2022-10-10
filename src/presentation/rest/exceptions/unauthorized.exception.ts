import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';

import { ApiException } from './api.exception';

class UnauthorizedException extends ApiException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'unauthorized', `${emoji.get('ticket')} Failed to authenticate.`);
  }
}

export { UnauthorizedException };
