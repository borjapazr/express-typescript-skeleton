import { StatusCodes } from 'http-status-codes';
import * as emoji from 'node-emoji';

import { ApiException } from './api.exception';

class InternalServerErrorException extends ApiException {
  constructor() {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'unexpected_error',
      `${emoji.get('fire')} An unexpected error has occurred. Please contact the administrator.`
    );
  }
}

export { InternalServerErrorException };
