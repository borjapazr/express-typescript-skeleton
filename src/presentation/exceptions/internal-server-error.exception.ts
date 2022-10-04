import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';

import { ApiException } from './api.exception';

class InternalServerErrorException extends ApiException {
  constructor() {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'unexpected_error',
      `${emoji.get('female-technologist')} An unexpected error has occurred. Please contact the administrator.`
    );
  }
}

export { InternalServerErrorException };
