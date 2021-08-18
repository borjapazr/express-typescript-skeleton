import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import emoji from 'node-emoji';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

import { LOGGER } from '@domain/shared';
import { ApiError } from '@presentation/errors/api.error';
import { ErrorResponse } from '@presentation/errors/error.response';

const ERROR_HANDLERS: { [error: string]: (response: Response, error: Error) => void } = {
  AccessDeniedError: (response: Response, error: Error) => {
    response
      .status(StatusCodes.FORBIDDEN)
      .send(new ErrorResponse(StatusCodes.FORBIDDEN, 'forbidden', `${emoji.get('x')} ${error.message}`));
  },

  DefaultError: (response: Response, error: Error) => {
    if (error instanceof ApiError) {
      const apiError = <ApiError>error;
      response.status(apiError.status).send(new ErrorResponse(apiError.status, apiError.code, apiError.message));
    } else {
      LOGGER.error(error);
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          new ErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'unexpected_error',
            `${emoji.get('female-technologist')} An unexpected error has occurred. Please contact the administrator.`
          )
        );
    }
  }
};

@Middleware({ type: 'after' })
class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: Error, _request: Request, response: Response, next: NextFunction): void {
    if (response.headersSent) {
      return next(error);
    }
    const handler = ERROR_HANDLERS[error.name || error.constructor.name] || ERROR_HANDLERS.DefaultError;
    return handler(response, error);
  }
}

export { ErrorHandlerMiddleware };
