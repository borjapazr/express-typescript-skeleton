import { StatusCodes } from 'http-status-codes';
import * as emoji from 'node-emoji';

import { ApiException } from './api.exception';

class BadRequestException extends ApiException {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, 'bad_request', `${emoji.get('-1')} ${message}.`);
  }
}

export { BadRequestException };
