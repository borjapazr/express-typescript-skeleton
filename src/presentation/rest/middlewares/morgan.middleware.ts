import { Middleware, MiddlewareMethods, Next, Req, Res } from '@tsed/common';
import morgan, { StreamOptions } from 'morgan';

import { LOGGER } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';

const stream: StreamOptions = {
  write: message => LOGGER.http(message.slice(0, Math.max(0, message.lastIndexOf('\n'))))
};

/**
 * Enable Morgan only in development mode.
 * This method is not really needed here since
 * we already told to the logger that it should print
 * only warning and error messages in production.
 */
const skip = (): boolean => GlobalConfig.IS_PRODUCTION;

@Middleware()
class MorganMiddleware implements MiddlewareMethods {
  public use(@Req() request: Req, @Res() response: Res, @Next() next: Next): void {
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream,
      skip
    })(request, response, next);
  }
}

export { MorganMiddleware };
