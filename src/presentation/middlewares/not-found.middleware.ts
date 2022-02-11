import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { NotFoundError } from '@presentation/errors';

@Middleware({ type: 'after' })
class NotFoundMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): void {
    if (!response.headersSent) {
      next(new NotFoundError(request.method, request.originalUrl));
    }
    response.end();
  }
}

export { NotFoundMiddleware };
