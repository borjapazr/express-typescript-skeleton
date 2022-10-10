import { Middleware, MiddlewareMethods, Next, Req, Res } from '@tsed/common';
import { NextFunction, Request, Response } from 'express';

import { PathNotFoundException } from '@presentation/rest/exceptions';

@Middleware()
class NotFoundMiddleware implements MiddlewareMethods {
  public use(@Req() request: Request, @Res() _response: Response, @Next() next: NextFunction): void {
    next(new PathNotFoundException(request.method, request.originalUrl));
  }
}

export { NotFoundMiddleware };
