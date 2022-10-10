import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';

import { ApiException } from './api.exception';

class ResourceNotFoundException extends ApiException {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, 'not_found', `${emoji.get('cry')} ${message}.`);
  }
}

export { ResourceNotFoundException };
