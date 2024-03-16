import { StatusCodes } from 'http-status-codes';
import * as emoji from 'node-emoji';

import { ApiException } from './api.exception';

class ForbiddenException extends ApiException {
  constructor() {
    super(StatusCodes.FORBIDDEN, 'forbidden', `${emoji.get('no_entry_sign')} Forbidden.`);
  }
}

export { ForbiddenException };
