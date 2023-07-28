import { StatusCodes } from 'http-status-codes';
import * as emoji from 'node-emoji';

import { ApiException } from './api.exception';

class ResourceNotFoundException extends ApiException {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, 'resource_not_found', `${emoji.get('cry')} ${message}.`);
  }
}

export { ResourceNotFoundException };
