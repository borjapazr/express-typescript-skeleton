import { Context, Middleware, MiddlewareMethods, Req, Res } from '@tsed/common';

import { PINO_LOGGER } from '@infrastructure/shared';
import { GlobalConfig } from '@infrastructure/shared/config';

@Middleware()
class LoggerMiddleware implements MiddlewareMethods {
  public use(@Req() request: Req, @Res() response: Res, @Context() context: Context): void {
    const loggerMiddleware = PINO_LOGGER.createPinoHttpMiddleware();
    loggerMiddleware(request, response);
    context.set(GlobalConfig.PINO_LOGGER_KEY, request.log);
  }
}

export { LoggerMiddleware };
