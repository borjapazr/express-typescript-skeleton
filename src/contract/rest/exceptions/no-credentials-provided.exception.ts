import { StatusCodes } from 'http-status-codes';
import * as emoji from 'node-emoji';

import { ApiException } from './api.exception';

class NoCredentialsProvidedException extends ApiException {
  constructor() {
    super(StatusCodes.BAD_REQUEST, 'no_credentials_provided', `${emoji.get('confused')} No credentials provided.`);
  }
}

export { NoCredentialsProvidedException };
